import * as dotenv from 'dotenv';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

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
    case 'customer.created': {}

    /**
    * Occurs whenever a customer is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.deleted}
    */
    case 'customer.deleted': {}

    /**
    * Occurs whenever a customer is signed up for a new plan.
    * @see {@link https://stripe.com/docs/api/events/types#event_types-customer.subscription.created}
    */
    case 'customer.subscription.created': {}

    /**
    * Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated}
    */
    case 'customer.subscription.updated': {}

    /**
    * Occurs whenever a customer’s subscription ends.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-customer.subscription.deleted}
    */
    case 'customer.subscription.deleted': {}

    /**
    * Occurs whenever a product is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.created}
    */
    case 'product.created': {}

    /**
    * Occurs whenever a product is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.updated}
    */
    case 'product.updated': {}

    /**
    * Occurs whenever a product is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-product.deleted}
    */
    case 'product.deleted': {}

    /**
    * Occurs whenever a price is created.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.created}
    */
    case 'price.created': {}

    /**
    * Occurs whenever a price is updated.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.updated}
    */
    case 'price.updated': {}

    /**
    * Occurs whenever a price is deleted.
    * @see {@link https://docs.stripe.com/api/events/types#event_types-price.deleted}
    */
    case 'price.deleted': {}

    default: {
      console.log(`Unhandled event type: ${event.type}`);
      return Response.json({ received: true }, { status: 200 });
    }
  }

}