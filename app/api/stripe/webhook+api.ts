import * as dotenv from 'dotenv';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import type { SubscriptionLevel, SubscriptionStatus } from '@/types';

dotenv.config();

const stripeSecret = process.env.EXPO_STRIPE_SECRET as string;
const stripe = new Stripe(stripeSecret, { apiVersion: '2024-09-30.acacia' });
/**
 * @api {post} /stripe/webhook Stripe Webhook
 * @apiName StripeWebhook
 * @apiGroup Stripe
 * @summary Handles Stripe webhook events
 */
export async function POST(request: Request) {
  const sig = request.headers.get('Stripe-Signature');
  const webhookSecret = process.env.EXPO_STRIPE_WEBHOOK_SECRET;
  let event;

  if (!sig) {
    console.log('⚠️  Missing Stripe-Signature header.');
    return Response.json({ error: 'Stripe-Signature header is missing' }, { status: 400 });
  }

  // Verify the signature
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    if (error instanceof Error) {
      console.log('⚠️  Webhook signature verification failed.', error.message);
    } else {
      console.log('⚠️  Webhook signature verification failed.', error);
    }
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    /**
     * Occurs whenever a new customer is created
      * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.created}
     */
    case 'customer.created': {
      try {
        const customer = event.data.object;
        console.log('***** STRIPE EVENT: customer.created *****');

        const { data, error } = await supabase
          .from('customers')
          .insert({
            stripe_customer_id: customer.id,
            profile_id: customer.metadata.profile_id,
          })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to create Stripe customer', error);
        }
      } catch (err) {
        console.error('Webhook: Failed to create Stripe customer', err);
      }
      break;
    }

    /**
    * Occurs whenever a customer is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.deleted}
    */
    case 'customer.deleted': {
      try {
        const customer = event.data.object;
        console.log('***** STRIPE EVENT: customer.deleted *****');

        const { data, error } = await supabase
          .from('customers')
          .update({
            deleted_at: new Date()
              .toISOString(),
          })
          .match({ stripe_customer_id: customer.id, profile_id: customer.metadata.profile_id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to delete customer', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to delete customer', error);
      }
      break;
    }

    /**
    * Occurs whenever a customer is signed up for a new plan.
    * @see {@link https://stripe.com/docs/api/events/types#event_types-customer.subscription.created}
    */
    case 'customer.subscription.created': {
      try {
        const subscription = event.data.object;
        console.log('***** STRIPE EVENT: customer.subscription.created *****');

        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            profile_id: subscription.metadata.profile_id,
            stripe_subscription_id: subscription.id,
            status: subscription.status as SubscriptionStatus,
            metadata: subscription.metadata,
            price_id: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000)
              .toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000)
              .toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
              .toISOString() : null,
          })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to create subscription', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to create subscription', error);
      }
      break;
    }

    /**
    * Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated}
    */
    case 'customer.subscription.updated': {
      try {
        const subscription = event.data.object;
        console.log('***** STRIPE EVENT: customer.subscription.updated *****');

        const { data, error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status as SubscriptionStatus,
            metadata: subscription.metadata,
            price_id: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000)
              .toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000)
              .toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000)
              .toISOString() : null,
          })
          .match({ stripe_subscription_id: subscription.id, profile_id: subscription.metadata.profile_id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to update subscription', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to update subscription', error);
      }
      break;
    }

    /**
    * Occurs whenever a customer’s subscription ends.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.deleted}
    */
    case 'customer.subscription.deleted': {
      try {
        const subscription = event.data.object;
        console.log('***** STRIPE EVENT: customer.subscription.deleted *****');

        const { data, error } = await supabase
          .from('subscriptions')
          .update({
            canceled_at: new Date()
              .toISOString(),
            status: subscription.status as SubscriptionStatus,
          })
          .match({ stripe_subscription_id: subscription.id, profile_id: subscription.metadata.profile_id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to delete subscription', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to delete subscription', error);
      }
      break;
    }

    /**
    * Occurs whenever a product is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.created}
    */
    case 'product.created': {
      try {
        const product = event.data.object;
        console.log('***** STRIPE EVENT: product.created *****');

        const { data, error } = await supabase
          .from('products')
          .insert({
            id: product.id,
            active: product.active,
            description: product.description,
            environment: product.livemode ? 'production' : 'test',
            image: product.images[0],
            metadata: product.metadata,
            name: product.name.toUpperCase() as SubscriptionLevel,
          })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to create product', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to create product', error);
      }
      break;
    }

    /**
    * Occurs whenever a product is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.updated}
    */
    case 'product.updated': {
      try {
        const product = event.data.object;
        console.log('***** STRIPE EVENT: product.updated *****');

        const { data, error } = await supabase
          .from('products')
          .update({
            active: product.active,
            description: product.description,
            environment: product.livemode ? 'production' : 'test',
            image: product.images[0],
            metadata: product.metadata,
            name: product.name.toUpperCase() as SubscriptionLevel,
          })
          .match({ id: product.id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to update product', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to update product', error);
      }
      break;
    }

    /**
    * Occurs whenever a product is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.deleted}
    */
    case 'product.deleted': {
      try {
        const product = event.data.object;
        console.log('***** STRIPE EVENT: product.deleted *****');

        const { data, error } = await supabase
          .from('products')
          .delete()
          .match({ id: product.id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to delete product', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to delete product', error);
      }
      break;
    }

    /**
    * Occurs whenever a price is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.created}
    */
    case 'price.created': {
      try {
        const price = event.data.object;
        console.log('***** STRIPE EVENT: price.created *****');

        const { data, error } = await supabase
          .from('prices')
          .insert({
            id: price.id,
            active: price.active,
            currency: price.currency,
            description: price.nickname,
            environment: price.livemode ? 'production' : 'test',
            interval_count: price.recurring?.interval_count,
            interval: price.recurring?.interval,
            metadata: price.metadata,
            product_id: price.product as string,
            type: price.type,
            unit_amount: price.unit_amount,
          })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to create price', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to create price', error);
      }
      break;
    }

    /**
    * Occurs whenever a price is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.updated}
    */
    case 'price.updated': {
      try {
        const price = event.data.object;
        console.log('***** STRIPE EVENT: price.updated *****');

        const { data, error } = await supabase
          .from('prices')
          .update({
            active: price.active,
            currency: price.currency,
            description: price.nickname,
            environment: price.livemode ? 'production' : 'test',
            interval_count: price.recurring?.interval_count,
            interval: price.recurring?.interval,
            metadata: price.metadata,
            product_id: price.product as string,
            type: price.type,
            unit_amount: price.unit_amount,
          })
          .match({ id: price.id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to update price', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to update price', error);
      }
      break;
    }

    /**
    * Occurs whenever a price is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.deleted}
    */
    case 'price.deleted': {
      try {
        const price = event.data.object;
        console.log('***** STRIPE EVENT: price.deleted *****');

        const { data, error } = await supabase
          .from('prices')
          .delete()
          .match({ id: price.id })
          .select();

        if (error || !data) {
          console.error('Webhook: Failed to delete price', error);
        }
      } catch (error) {
        console.error('Webhook: Failed to delete price', error);
      }
      break;
    }

    default: {
      console.warn(`Unhandled event type: ${event.type}`);
    }
  }

}