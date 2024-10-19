import * as dotenv from 'dotenv';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { SubscriptionStatus } from '@/types';
import type { SubscriptionApiResponse } from '@/types/helpers';

dotenv.config();

const stripeSecret = process.env.EXPO_STRIPE_SECRET as string;
const stripe = new Stripe(stripeSecret, { apiVersion: '2024-09-30.acacia' });

/**
 * @api {get} /api/stripe/subscription Fetch Stripe Subscription
 * @apiName GetSubscription
 * @apiGroup Stripe
 * @param { string } Authorization.header.required - The authorization token
 * @summary Fetches the profile's subscription data from Stripe
 */
export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    // Exract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Token is missing' }, { status: 401 });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user?.id) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // fetch customer from supabase first
    const { data: customer, error: customerError } = await supabase.from('customers')
      .select('stripe_customer_id')
      .eq('profile_id', data?.user?.id)
      .single();

    if (customerError || !customer?.stripe_customer_id) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
    }

    // fetch the customer from Stripe
    const stripeCustomer = await stripe.customers.retrieve(customer.stripe_customer_id);

    // Check if the customer is deleted
    if ((stripeCustomer as Stripe.DeletedCustomer).deleted) {
      return Response.json({ error: 'Customer has been deleted' }, { status: 404 });
    }

    // fetch the subscriptions
    const subscriptions = await stripe.subscriptions.list({ customer: customer.stripe_customer_id });

    // get the next billing date
    const nextBillingDate = subscriptions.data[0]?.current_period_end ?? null;

    // fetch the payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.stripe_customer_id,
      type: 'card',
    });

    // fetch the invoices
    const invoices = await stripe.invoices.list({
      customer: customer.stripe_customer_id,
      limit: 15,
    });

    const response: SubscriptionApiResponse = {
      customer: stripeCustomer as Stripe.Customer,
      subscriptions: subscriptions.data,
      nextBillingDate,
      paymentMethods: paymentMethods.data,
      invoices: invoices.data,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @api {post} /api/stripe/subscription Create Subscription
 * @apiName CreateSubscription
 * @apiGroup Stripe
 * @summary Creates a new subscription for the user in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 * @param { string } Authorization.header.required - The authorization token
 */
export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    // Exract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Token is missing' }, { status: 401 });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user?.id) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Read the subscription from the request body
    const body = await request.json();
    const { subscription } = body;

    // Fetch the price id for the new plan from Supabase
    const { data: price, error: priceError } = await supabase.from('prices')
      .select('id')
      .eq('identifier', subscription)
      .single();

    if (priceError || !price?.id) {
      return Response.json({ error: 'Price not found' }, { status: 404 });
    }

    // Fetch the user's profile from Supabase
    const { data: profile, error: profileError } = await supabase.from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Create the customer in Stripe
    const stripeCustomer = await stripe.customers.create({
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      metadata: { profile_id: profile.id },
    });

    if (!stripeCustomer.id) {
      return Response.json({ error: 'Failed to create Stripe customer' }, { status: 500 });
    }

    // Create the subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: price.id }],
    });

    if (!stripeSubscription.id) {
      return Response.json({ error: 'Failed to create Stripe subscription' }, { status: 500 });
    }

    // Save the customer in Supabase
    const { data: newCustomer, error: newCustomerError } = await supabase.from('customers')
      .insert({
        profile_id: profile.id,
        stripe_customer_id: stripeCustomer.id,
      })
      .select();

    if (newCustomerError || !newCustomer) {
      return Response.json({ error: 'Failed to save new customer' }, { status: 500 });
    }

    // Save the subscription in Supabase
    const { data: newSubscription, error: newSubscriptionError } = await supabase.from('subscriptions')
      .insert({
        profile_id: profile.id,
        status: SubscriptionStatus.active,
        metadata: { profile_id: profile.id },
        price_id: price.id,
        quantity: 1,
        cancel_at_period_end: false,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000)
          .toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000)
          .toISOString(),
        ended_at: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000)
          .toISOString() : null,
        stripe_subscription_id: stripeSubscription.id,
      })
      .select();

    if (newSubscriptionError || !newSubscription) {
      return Response.json({ error: 'Failed to save new subscription' }, { status: 500 });
    }

    return Response.json({ message: 'Subscription created successfully' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @api {put} /api/stripe/subscription Update Subscription
 * @apiName UpdateSubscription
 * @apiGroup Stripe
 * @summary Updates a subscription for the user in Stripe
 * @param { string } subscription.body.required - The subscription value to create
 * @param { string } Authorization.header.required - The authorization token
 */
export async function PUT(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    // Exract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Token is missing' }, { status: 401 });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user?.id) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Fetch the user's subscription from Supabase
    const { data: currentSubscription, error: currentSubscriptionError } = await supabase.from('subscriptions')
      .select('stripe_subscription_id')
      .eq('profile_id', data.user.id)
      .single();

    if (currentSubscriptionError || !currentSubscription?.stripe_subscription_id) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Read the subscription from the request body
    const body = await request.json();
    const { subscription } = body;

    // Fetch the price ID for the new plan from Supabase
    const { data: price, error: priceError } = await supabase.from('prices')
      .select('*')
      .eq('identifier', subscription)
      .single();

    if (priceError || !price) {
      return Response.json({ error: 'Price not found' }, { status: 404 });
    }

    // Fetch the subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id);

    if (!stripeSubscription.id) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Get the id of the first item
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Update the subscription in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.update(currentSubscription.stripe_subscription_id, { items: [{ id: subscriptionItemId, price: price.id }] });

    // Update the subscription in Supabase
    const { data: updatedSubscription, error: updatedSubscriptionError } = await supabase.from('subscriptions')
      .update({
        price_id: price.id,
        current_period_start: new Date(updatedStripeSubscription.current_period_start)
          .toISOString(),
        current_period_end: new Date(updatedStripeSubscription.current_period_end)
          .toISOString(),
        ended_at: updatedStripeSubscription.ended_at ? new Date(updatedStripeSubscription.ended_at)
          .toISOString() : null,
        cancel_at_period_end: updatedStripeSubscription.cancel_at_period_end,
        stripe_subscription_id: updatedStripeSubscription.id,
      })
      .eq('profile_id', data.user.id)
      .select();

    if (updatedSubscriptionError || !updatedSubscription) {
      return Response.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    return Response.json({ message: 'Subscription updated successfully' }, { status: 200 });

  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}