/**
 * @api {get} /api/stripe/subscription Fetch Stripe Subscription
 * @apiName GetSubscription
 * @summary Fetches the profile's subscription data from Stripe
 */
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import type { SubscriptionApiResponse } from '@/types/helpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

export async function GET() {
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log({ data, error });

    if (error || !data?.user?.id) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // fetch customer from supabase first
    const { data: customer, error: customerError } = await supabase.from('customers')
      .select('stripe_customer_id')
      .eq('profile_id', data?.user?.id)
      .single();
    console.log({ customer, customerError });

    if (customerError || !customer?.stripe_customer_id) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
    }

    // fetch the customer from Stripe
    const stripeCustomer = await stripe.customers.retrieve(customer.stripe_customer_id);
    console.log({ stripeCustomer });

    // Check if the customer is deleted
    if ((stripeCustomer as Stripe.DeletedCustomer).deleted) {
      return new Response(JSON.stringify({ error: 'Customer has been deleted' }), { status: 404 });
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

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
