
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "address_standardizer" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."category_item_position" AS (
  category_item_id INT,
  category_id INT,
  item_id INT,
  new_position INT
);
ALTER TYPE "public"."category_item_position" OWNER TO "postgres";

CREATE TYPE "public"."question_type" AS (
  question_id integer,
  question text
);

CREATE TYPE "public"."answer_type" AS (
  answer_id integer,
  answer text
);

CREATE TYPE "public"."measuring_system" AS ENUM (
    'IMPERIAL',
    'METRIC'
);

ALTER TYPE "public"."measuring_system" OWNER TO "postgres";

CREATE TYPE "public"."pricing_plan_interval" AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";

CREATE TYPE "public"."pricing_type" AS ENUM (
    'one_time',
    'recurring'
);

ALTER TYPE "public"."pricing_type" OWNER TO "postgres";

CREATE TYPE "public"."resource_type" AS ENUM (
    'USER',
    'GROUP'
);

ALTER TYPE "public"."resource_type" OWNER TO "postgres";

CREATE TYPE "public"."subscription_level" AS ENUM (
    'FREE',
    'MONTHLY',
    'ANNUAL',
    'LIFE'
);

ALTER TYPE "public"."subscription_level" OWNER TO "postgres";

CREATE TYPE "public"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
);

ALTER TYPE "public"."subscription_status" OWNER TO "postgres";

CREATE TYPE "public"."theme" AS ENUM (
    'BLUE6',
    'BLUEGREEN6',
    'BREEZE6',
    'CELESTIAL6',
    'CIRCUIT6',
    'DAMASK6',
    'DEPTH6',
    'FLOW6',
    'FORTE6',
    'GENESIS6',
    'GRAYSCALE6',
    'IONBOARDROOM6',
    'KILTER6',
    'TABLEAU10',
    'COLORBLIND10',
    'JEWELBRIGHT9',
    'HUECIRCLE19'
);

ALTER TYPE "public"."theme" OWNER TO "postgres";

CREATE TYPE "public"."trip_friend_status" AS ENUM (
    'ACCEPTED',
    'DECLINED',
    'PENDING'
);

ALTER TYPE "public"."trip_friend_status" OWNER TO "postgres";

CREATE TYPE "public"."trip_invitation_status" AS ENUM (
    'ACCEPTED',
    'DECLINED',
    'PENDING'
);

ALTER TYPE "public"."trip_invitation_status" OWNER TO "postgres";

CREATE TYPE "public"."friend_request_status" AS ENUM (
  'PENDING',
  'ACCEPTED',
  'DECLINED'
);

ALTER TYPE "public"."friend_request_status" OWNER TO "postgres";

CREATE TYPE "public"."user_role" AS ENUM (
    'ADMIN',
    'USER'
);

ALTER TYPE "public"."user_role" OWNER TO "postgres";

CREATE TYPE "public"."trip_details_type" AS ENUM (
    'HIKE',
    'TRIP'
);

ALTER TYPE "public"."trip_details_type" OWNER TO "postgres";

ALTER TABLE profiles
ADD COLUMN fts tsvector GENERATED ALWAYS AS (
  to_tsvector('simple', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(trail_name, ''))
) STORED;

CREATE INDEX profiles_fts ON profiles USING gin (fts); -- generate the index

CREATE OR REPLACE FUNCTION "public"."search_profiles"(search_query text)
RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY SELECT *
  FROM "public"."profiles"
  WHERE fts @@ to_tsquery('simple', search_query)
  AND id <> '00000000-0000-0000-0000-000000000000'; -- Exclude the Admin user
END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "public"."generate_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
	NEW.slug := gen_random_uuid();
	RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."update_profile_image"() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE "public"."profiles"
    SET "image" = NEW.name
    WHERE "id" = (storage.foldername(NEW.name))[1]::uuid;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE "public"."profiles"
    SET "image" = NULL
    WHERE "id" = (storage.foldername(OLD.name))[1]::uuid;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_image_after_insert_or_delete
AFTER INSERT OR DELETE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION "public"."update_profile_image"();

CREATE TRIGGER "generate_slug_for_profiles"
BEFORE INSERT ON "public"."profiles"
FOR EACH ROW
EXECUTE FUNCTION "public"."generate_slug"();

ALTER FUNCTION "public"."generate_slug"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
  RETURNS "trigger"
  LANGUAGE "plpgsql"
  SECURITY DEFINER
AS $$
begin
  -- Insert the user's profile
  INSERT INTO public.profiles (id, email, first_name, last_name, image, role, measuring_system)
  values (new.id, new.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', null, 'USER', 'IMPERIAL')
  ON CONFLICT (id) DO UPDATE SET email = new.email;

  -- Insert default notifications
  INSERT INTO public.notifications (title, content, read_on_date, profile_id, sender_id)
  values ('Welcome!', 'Welcome to Gear Closet! This is where you will receive all of your important updates.', null, new.id, '00000000-0000-0000-0000-000000000000');

  -- Insert default trip
  INSERT INTO public.trips (name, description, starting_point, ending_point, starting_date, ending_date, slug, profile_id)
  values ('My first trip!', 'This is my first trip to plan.', 'Starting point', 'Ending point', null, null, null, new.id);

  -- Insert default preferences
  INSERT INTO public.preferences (profile_id, preference_key, preference_label, preference_value, preference_group)
  VALUES 
    (NEW.id, 'push_new_friend_requests', 'New friend requests', TRUE, 'PUSH'),
    (NEW.id, 'push_new_comments_on_pack_list', 'New comments on your pack list', TRUE, 'PUSH'),
    (NEW.id, 'email_tips_updates_how_tos', 'Tips, updates, and how-tos', TRUE, 'EMAIL'),
    (NEW.id, 'email_subscription_updates', 'Updates to your subscription', TRUE, 'EMAIL');

  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) RETURNS "json"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
  DECLARE
    trip_friends JSON;
    trips JSON;
    friends JSON;
  BEGIN
    -- Fetch trip_friends
    SELECT COALESCE(json_agg(row_to_json(tf.*)), '[]'::JSON) INTO trip_friends
    FROM trip_friends tf
    WHERE tf.profile_id = p_user_id;

    -- Fetch trips
    SELECT COALESCE(json_agg(row_to_json(t.*)), '[]'::JSON) INTO trips
    FROM trips t
    WHERE t.profile_id = p_user_id
    AND t.starting_date >= NOW();

    -- Fetch friends
    SELECT COALESCE(json_agg(row_to_json(sub.*)), '[]'::JSON) INTO friends
    FROM (
      SELECT f.*, row_to_json(p.*) AS friend
      FROM friends f
      JOIN profiles p ON f.friend_id = p.id
      WHERE f.profile_id = p_user_id
    ) sub;

    -- Output the result
    RETURN json_build_object(
        'trip_friends', trip_friends,
        'trips', trips,
        'friends', friends
    );
  END;
$$;
ALTER FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_poll"("trip_id" bigint, "question" text, "answers" text[])
  RETURNS "json"
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$
  DECLARE
    new_poll_id integer;
    new_question_id integer;
    new_poll "json";
    i integer;
  BEGIN
    -- Insert the poll
    INSERT INTO polls (trip_id, profile_id)
    VALUES (trip_id, auth.uid())
    RETURNING id INTO new_poll_id;

    -- Insert the question
    INSERT INTO questions (poll_id, profile_id, title)
    VALUES (new_poll_id, auth.uid(), question)
    RETURNING id INTO new_question_id;

    -- Insert the answers
    FOR i IN 1..array_length(answers, 1)
    LOOP
      INSERT INTO answers (question_id, profile_id, content)
      VALUES (new_question_id, auth.uid(), answers[i]);
    END LOOP;

    -- Select the newly created poll, question, and answers
    SELECT json_build_object(
      'id', p.id::integer,
      'trip_id', p.trip_id::integer,
      'profile_id', p.profile_id::uuid,
      'question', (SELECT row_to_json(q.*) FROM questions q WHERE q.id = new_question_id),
      'answers', COALESCE((SELECT json_agg(row_to_json(a.*)) FROM answers a WHERE a.question_id = new_question_id), '[]'),
      'votes', COALESCE((SELECT json_agg(row_to_json(pa.*)) FROM profile_answers pa WHERE pa.poll_id = new_poll_id), '[]')
    )
    INTO new_poll
    FROM polls p
    WHERE p.id = new_poll_id;

    RETURN new_poll;
  END;
$$;

ALTER FUNCTION "public"."create_poll"("trip_id" bigint, "question" text, "answers" text[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_poll"("poll_id" bigint, "question" text, "answers" text[])
  RETURNS "json"
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$
  DECLARE
    updated_poll "json";
    i integer;
    answer_ids bigint[];
    question_id bigint;
  BEGIN
    -- Update the question
    UPDATE questions SET title = question WHERE questions.poll_id = update_poll.poll_id;

    -- Get the IDs of the existing answers
    SELECT array_agg(id) INTO answer_ids FROM answers WHERE answers.question_id IN (SELECT id FROM questions WHERE questions.poll_id = update_poll.poll_id);

    -- Get the question ID
    SELECT id INTO question_id FROM questions WHERE questions.poll_id = update_poll.poll_id;

    -- Update the answers
    FOR i IN 1..array_length(update_poll.answers, 1)
    LOOP
      IF i <= array_length(answer_ids, 1) THEN
        -- Update existing answer
        UPDATE answers SET content = update_poll.answers[i] WHERE id = answer_ids[i];
      ELSE
        -- Insert new answer
        INSERT INTO answers (content, question_id) VALUES (update_poll.answers[i], question_id);
      END IF;
    END LOOP;

    -- Select the updated poll, question, and answers
    SELECT json_build_object(
      'id', p.id::integer,
      'trip_id', p.trip_id::integer,
      'profile_id', p.profile_id::uuid,
      'question', (SELECT row_to_json(q.*) FROM questions q WHERE q.poll_id = update_poll.poll_id),
      'answers', COALESCE((SELECT json_agg(row_to_json(a.*)) FROM answers a WHERE a.question_id IN (SELECT id FROM questions WHERE questions.poll_id = update_poll.poll_id)), '[]'),
      'votes', COALESCE((SELECT json_agg(row_to_json(pa.*)) FROM profile_answers pa WHERE pa.poll_id = update_poll.poll_id), '[]')
    )
    INTO updated_poll
    FROM polls p
    WHERE p.id = update_poll.poll_id;

    RETURN updated_poll;
  END;
$$;

ALTER FUNCTION "public"."update_poll"("poll_id" bigint, "question" text, "answers" text[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) RETURNS "json"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
  DECLARE
    trips_data JSON;
    trip_packs_data JSON;
    trip_details_data JSON;
    todos_data JSON;
    shopping_items_data JSON;
    friends_data JSON;
    poll_data JSON;
    dynamic_trip_id BIGINT;
  BEGIN
    -- Fetch trips data
    SELECT json_agg(row_to_json(sub.*)) INTO trips_data
    FROM (
      SELECT * FROM trips t
      WHERE t.profile_id = auth.uid()
      ORDER BY t.created_at ASC
    ) sub;

    -- Set dynamic_trip_id based on p_trip_id or to the ID of the first trip
    IF p_trip_id = 0 THEN
      SELECT COALESCE((SELECT t.id FROM trips t WHERE t.profile_id = auth.uid() ORDER BY t.created_at ASC LIMIT 1), 0) INTO dynamic_trip_id;
    ELSE
      dynamic_trip_id := p_trip_id;
    END IF;

    -- Fetch trip packs data using dynamic_trip_id along with associated pack details
    SELECT (COALESCE(json_agg(
      json_build_object(
        'id', pack.id,
        'name', pack.name,
        'slug', pack.slug,
        'created_at', pack.created_at,
        'updated_at', pack.updated_at,
        'profile_id', pack.profile_id,
        'theme', pack.theme,
        'private', pack.private,
        'allow_comments', pack.allow_comments,
        'categories', (
          SELECT COALESCE(json_agg(json_build_object(
            'id', c.id,
            'created_at', c.created_at,
            'name', c.name,
            'unit', c.unit,
            'slug', c.slug,
            'pack_id', c.pack_id,
            'updated_at', c.updated_at,
            'category_items', (
              SELECT COALESCE(json_agg(json_build_object(
                'id', ci.id,
                'category_id', ci.category_id,
                'item_id', ci.item_id,
                'position', ci.position,
                'created_at', ci.created_at,
                'updated_at', ci.updated_at,
                'item', row_to_json(i.*)
              )), '[]'::JSON)
              FROM category_items ci
              JOIN items i ON ci.item_id = i.id
              WHERE ci.category_id = c.id
            )
          )), '[]'::JSON)
          FROM categories c
          WHERE c.pack_id = pack.id
        )
      )
    ), '[]'::JSON) -> 0) INTO trip_packs_data
    FROM trip_packs tp
    JOIN packs pack ON tp.pack_id = pack.id
    WHERE tp.profile_id = auth.uid()
      AND (p_trip_id = 0 OR tp.trip_id = dynamic_trip_id);

    -- Fetch trip details data
    SELECT COALESCE(json_agg(row_to_json(td.*)), '[]'::JSON) INTO trip_details_data
    FROM trip_details td
    WHERE td.trip_id = dynamic_trip_id;

    -- Fetch todos data
    SELECT COALESCE(json_agg(row_to_json(todo.*)), '[]'::JSON) INTO todos_data
    FROM todos todo
    WHERE todo.trip_id = dynamic_trip_id;

    -- Fetch shopping items data
    SELECT COALESCE(json_agg(row_to_json(si.*)), '[]'::JSON) INTO shopping_items_data
    FROM shopping_list_items si
    WHERE si.trip_id = dynamic_trip_id;

    -- Fetch friends data with details from related tables
    SELECT COALESCE(json_agg(json_build_object(
      'friend_profile', row_to_json(p.*),
      'friend_trip_packs', (
        SELECT COALESCE(json_agg(row_to_json(tp.*)), '[]'::JSON)
        FROM trip_packs tp
        WHERE tp.profile_id = tf.friend_id
          AND (p_trip_id = 0 OR tp.trip_id = dynamic_trip_id)
      )
    )), '[]'::JSON) INTO friends_data
    FROM trip_friends tf
    JOIN profiles p ON tf.friend_id = p.id  -- Join on friend_id instead of profile_id
    WHERE tf.invited_by_id = auth.uid();  -- Select only the records where the authenticated user is the inviter

    -- Fetch poll data
    SELECT json_build_object(
      'id', p.id::integer,
      'trip_id', p.trip_id::integer,
      'profile_id', p.profile_id::uuid,
      'question', (SELECT row_to_json(q.*) FROM questions q WHERE q.poll_id = p.id),
      'answers', COALESCE((SELECT json_agg(row_to_json(a.*)) FROM answers a WHERE a.question_id = q.id), '[]'),
      'votes', COALESCE((SELECT json_agg(row_to_json(pa.*)) FROM profile_answers pa WHERE pa.poll_id = p.id), '[]')
    ) INTO poll_data
    FROM polls p
    JOIN questions q ON p.id = q.poll_id
    WHERE p.trip_id = dynamic_trip_id
    LIMIT 1;

    -- Output the result
    RETURN jsonb_build_object(
      'trips', trips_data,
      'pack', trip_packs_data,
      'trip_details', trip_details_data,
      'todos', todos_data,
      'shopping_items', shopping_items_data,
      'friends', friends_data,
      'poll', poll_data
    );
    END;
$$;

ALTER FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) RETURNS "json"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
  DECLARE
    pack_data JSON;
    dynamic_pack_id BIGINT;
    user_packs JSON;
  BEGIN
    -- Set dynamic_pack_id based on p_pack_id or to the ID of the first pack
    IF p_pack_id = 0 THEN
      SELECT COALESCE((SELECT p.id FROM packs p WHERE p.profile_id = auth.uid() ORDER BY p.created_at ASC LIMIT 1), 0) INTO dynamic_pack_id;
    ELSE
      dynamic_pack_id := p_pack_id;
    END IF;

    -- Fetch all user's packs
    SELECT COALESCE((SELECT json_agg(json_build_object('id', p.id, 'name', p.name, 'slug', p.slug)) FROM packs p WHERE p.profile_id = auth.uid()), '[]'::JSON) INTO user_packs;

    -- Fetch pack data using dynamic_pack_id along with associated category details, category items, and items
    SELECT COALESCE((SELECT json_build_object(
      'pack', json_build_object(
        'id', pack.id,
        'name', pack.name,
        'slug', pack.slug,
        'created_at', pack.created_at,
        'updated_at', pack.updated_at,
        'profile_id', pack.profile_id,
        'theme', pack.theme,
        'private', pack.private,
        'allow_comments', pack.allow_comments,
        'categories', (
          SELECT COALESCE(json_agg(json_build_object(
            'id', sub.id,
            'created_at', sub.created_at,
            'name', sub.name,
            'unit', sub.unit,
            'slug', sub.slug,
            'pack_id', sub.pack_id,
            'updated_at', sub.updated_at,
            'category_items', sub.category_items
          )), '[]'::JSON)
          FROM (
            SELECT 
              c.id,
              c.created_at,
              c.name,
              c.unit,
              c.slug,
              c.pack_id,
              c.updated_at,
              (
                SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.position), '[]'::JSON)
                FROM (
                  SELECT 
                    ci.id,
                    ci.category_id,
                    ci.item_id,
                    ci.position,
                    ci.created_at,
                    ci.updated_at,
                    row_to_json(i.*) AS item
                  FROM category_items ci
                  JOIN items i ON ci.item_id = i.id
                  WHERE ci.category_id = c.id
                ) t
              ) AS category_items
            FROM categories c
            WHERE c.pack_id = dynamic_pack_id
            ORDER BY c.created_at DESC
          ) AS sub
        )
      ),
      'packs', user_packs
    ) FROM packs pack WHERE pack.id = dynamic_pack_id ORDER BY pack.created_at DESC), '[]'::JSON) INTO pack_data;

    -- Output the result
    RETURN pack_data;
  END;
$$;
ALTER FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  "row_data" JSONB;
  "cat_id" BIGINT;
  "item_id" BIGINT;
  "item_position" INTEGER;  -- renamed from "position"
BEGIN
  FOR "row_data" IN SELECT * FROM jsonb_array_elements("csv_data")
  LOOP
    -- Try to get the existing category id
    SELECT "id" INTO "cat_id" FROM "public"."categories" WHERE "name" = "row_data"->>'category' AND "pack_id" = "p_pack_id";

    -- If category doesn't exist, insert it and get the id
    IF "cat_id" IS NULL THEN
      INSERT INTO "public"."categories" ("name", "slug", "unit", "pack_id", "created_at", "updated_at")
      VALUES ("row_data"->>'category', 'slug', 'g', "p_pack_id", NOW(), NOW())
      RETURNING "id" INTO "cat_id";
      -- Reset position counter for new category
      "item_position" := 1;  -- renamed from "position"
    ELSE
      -- Get the current maximum position in the category
      SELECT COALESCE(MAX("position"), 0) + 1 INTO "item_position" FROM "public"."category_items" WHERE "category_id" = "cat_id";  -- renamed from "position"
    END IF;

    -- Insert item
    INSERT INTO "public"."items" ("name", "generic_type", "price", "consumable", "worn", "quantity", "unit", "weight", "url", "slug", "created_at", "updated_at", "profile_id")
    VALUES ("row_data"->>'item_name', "row_data"->>'desc', ("row_data"->>'price')::bigint, (trim("row_data"->>'consumable') != '')::boolean, (trim("row_data"->>'worn') != '')::boolean, ("row_data"->>'qty')::bigint, "row_data"->>'unit', ("row_data"->>'weight')::numeric, "row_data"->>'url', 'slug', NOW(), NOW(), auth.uid())
    RETURNING "id" INTO "item_id";

    -- Link item to category
    INSERT INTO "public"."category_items" ("category_id", "item_id", "position", "created_at", "updated_at")
    VALUES ("cat_id", "item_id", "item_position", NOW(), NOW());  -- renamed from "position"
  END LOOP;

  -- Return the data in the desired format
  RETURN (
    SELECT json_agg(json_build_object(
      'id', c.id,
      'name', c.name,
      'slug', c.slug,
      'unit', c.unit,
      'pack_id', c.pack_id,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'category_items', (
        SELECT json_agg(json_build_object(
          'id', ci.id,
          'category_id', ci.category_id,
          'item_id', ci.item_id,
          'position', ci.position,
          'created_at', ci.created_at,
          'updated_at', ci.updated_at,
          'item', i.*
        ))
        FROM "public"."category_items" ci
        JOIN "public"."items" i ON ci."item_id" = i."id"
        WHERE ci."category_id" = c."id"
      )
    ))
    FROM "public"."categories" c
    WHERE c."pack_id" = "p_pack_id"
  );
END;
$$;
ALTER FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_category_and_item"(
  "p_name" TEXT,
  "p_pack_id" BIGINT,
  "p_items" JSONB
)
  RETURNS JSON
  LANGUAGE plpgsql
  AS $$
  DECLARE
    "new_category_id" BIGINT;
    "new_item_id" BIGINT;
    "item" JSONB;
  BEGIN
    -- Insert the new category
    INSERT INTO "public"."categories" ("name", "pack_id")
    VALUES ("p_name", "p_pack_id")
    RETURNING "id" INTO "new_category_id";

    -- Loop through the items array
    FOR item IN SELECT * FROM jsonb_array_elements("p_items")
    LOOP
      -- Insert the new item
      INSERT INTO "public"."items" ("name", "generic_type", "weight", "quantity", "price", "consumable", "worn", "profile_id")
      VALUES (item->>'name', item->>'generic_type', item->>'weight', (item->>'quantity')::bigint, (item->>'price')::bigint, (item->>'consumable')::boolean, (item->>'worn')::boolean, auth.uid())
      RETURNING "id" INTO "new_item_id";

      -- Link the new category and item in the category_items table
      INSERT INTO "public"."category_items" ("category_id", "item_id", "position")
      VALUES ("new_category_id", "new_item_id", 1);
    END LOOP;

    -- Return the new category and item in the same format as the other functions
    RETURN (
      SELECT row_to_json(t)
      FROM (
        SELECT c."id", c."name", c."slug", c."unit", c."pack_id", c."created_at", c."updated_at", json_agg(json_build_object(
          'id', ci."id",
          'category_id', ci."category_id",
          'item_id', ci."item_id",
          'position', ci."position",
          'created_at', ci."created_at",
          'updated_at', ci."updated_at",
          'item', json_build_object(
            'id', i."id",
            'name', i."name",
            'generic_type', i."generic_type",
            'weight', i."weight",
            'quantity', i."quantity",
            'price', i."price",
            'consumable', i."consumable",
            'worn', i."worn",
            'profile_id', i."profile_id"
          )
        )) AS "category_items"
        FROM "public"."categories" c
        JOIN "public"."category_items" ci ON c."id" = ci."category_id"
        JOIN "public"."items" i ON ci."item_id" = i."id"
        WHERE c."id" = "new_category_id"
        GROUP BY c."id", c."name", c."slug", c."unit", c."pack_id", c."created_at", c."updated_at"
      ) t
    );
  END;
$$;
ALTER FUNCTION "public"."create_category_and_item"(TEXT, BIGINT, JSONB) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_positions"(records public.category_item_position[])
RETURNS SETOF json AS $$
DECLARE
  r public.category_item_position;
  i integer;
  updated_record json;
BEGIN
  FOR i IN 1..array_length(records, 1)
  LOOP
    r := records[i];
    UPDATE public.category_items
    SET position = r.new_position, category_id = r.category_id
    WHERE id = r.category_item_id;

    SELECT row_to_json(category_items) INTO updated_record
    FROM public.category_items
    WHERE id = r.category_item_id;

    RETURN NEXT updated_record;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION "public"."update_positions"(records public.category_item_position[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."answers" (
    "id" bigint NOT NULL,
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid",
    "question_id" bigint
);

ALTER TABLE "public"."answers" OWNER TO "postgres";

ALTER TABLE "public"."answers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."answers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying,
    "unit" character varying DEFAULT 'g'::character varying,
    "slug" character varying,
    "pack_id" bigint,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."category_items" (
    "id" bigint NOT NULL,
    "category_id" bigint,
    "item_id" bigint,
    "position" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."category_items" OWNER TO "postgres";

ALTER TABLE "public"."category_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."category_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "text" "text",
    "profile_id" "uuid" NOT NULL,
    "pack_id" bigint NOT NULL,
    "deleted_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "stripe_customer_id" "text",
    "profile_id" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone
);

ALTER TABLE "public"."customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid",
    "friend_id" "uuid"
);

ALTER TABLE "public"."friends" OWNER TO "postgres";

ALTER TABLE "public"."friends" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."friends_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."friend_invitations" (
  "id" bigint NOT NULL,
  "sender_id" "uuid",
  "recipient_id" "uuid",
  "status" "public"."friend_request_status" DEFAULT 'PENDING'::"public"."friend_request_status" NOT NULL,
  "request_sent_at" timestamp with time zone DEFAULT "now"(),
  "request_responded_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT "now"(),
  "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."friend_invitations" OWNER TO "postgres";

ALTER TABLE "public"."friend_invitations"
ALTER COLUMN "request_sent_at" SET DEFAULT NOW();

ALTER TABLE "public"."friend_invitations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
  SEQUENCE NAME "public"."friend_invitations_id_seq"
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."items" (
    "id" bigint NOT NULL,
    "name" character varying,
    "generic_type" character varying,
    "price" bigint DEFAULT '0'::bigint,
    "consumable" boolean DEFAULT false,
    "worn" boolean DEFAULT false,
    "quantity" bigint DEFAULT '0'::bigint,
    "unit" character varying DEFAULT 'g'::character varying,
    "weight" "text",
    "url" "text",
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid"
);

ALTER TABLE "public"."items" OWNER TO "postgres";

ALTER TABLE "public"."items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "title" character varying,
    "content" "text",
    "read_on_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid",
    "sender_id" "uuid"
);

ALTER TABLE "public"."notifications" OWNER TO "postgres";

ALTER TABLE "public"."notifications"
ALTER COLUMN "sender_id" SET DEFAULT '00000000-0000-0000-0000-000000000000';

ALTER TABLE "public"."notifications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."onboarding_steps" (
    "profile_id" "uuid" NOT NULL,
    "page" "text" NOT NULL,
    "completion_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."onboarding_steps" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."packs" (
    "id" bigint NOT NULL,
    "name" character varying,
    "slug" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid" NOT NULL,
    "theme" "public"."theme" DEFAULT 'BLUE6'::"public"."theme",
    "private" boolean DEFAULT false NOT NULL,
    "allow_comments" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."packs" OWNER TO "postgres";

ALTER TABLE "public"."packs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."packs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."polls" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid",
    "trip_id" bigint
);

ALTER TABLE "public"."polls" OWNER TO "postgres";

ALTER TABLE "public"."polls" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."polls_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" "text" NOT NULL,
    "product_id" "text",
    "active" boolean,
    "description" "text",
    "unit_amount" bigint,
    "currency" "text",
    "type" "public"."pricing_type",
    "interval" "public"."pricing_plan_interval",
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" "jsonb",
    "identifier" "public"."subscription_level" DEFAULT 'FREE'::"public"."subscription_level",
    "environment" "text" DEFAULT 'development'::"text",
    CONSTRAINT "prices_currency_check" CHECK (("char_length"("currency") = 3))
);

ALTER TABLE "public"."prices" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "name" "public"."subscription_level",
    "description" "text",
    "image" "text",
    "metadata" "jsonb",
    "environment" "text"
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" bigint NOT NULL,
    "title" "text",
    "poll_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid"
);

ALTER TABLE "public"."questions" OWNER TO "postgres";

ALTER TABLE "public"."questions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."questions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."replies" (
    "id" bigint NOT NULL,
    "comment_id" bigint NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "text" "text",
    "deleted_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text")
);

ALTER TABLE "public"."replies" OWNER TO "postgres";

ALTER TABLE "public"."replies" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."replies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."shopping_list_items" (
    "id" bigint NOT NULL,
    "title" character varying,
    "completed" boolean DEFAULT false NOT NULL,
    "quantity" bigint DEFAULT '0'::bigint,
    "trip_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "resource_type" "public"."resource_type" DEFAULT 'USER'::"public"."resource_type" NOT NULL,
    "profile_id" "uuid"
);

ALTER TABLE "public"."shopping_list_items" OWNER TO "postgres";

ALTER TABLE "public"."shopping_list_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."shopping_list_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "status" "public"."subscription_status",
    "metadata" "jsonb",
    "price_id" "text",
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "cancel_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "canceled_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "stripe_subscription_id" "text",
);

ALTER TABLE "public"."subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."todos" (
    "id" bigint NOT NULL,
    "title" character varying,
    "completed" boolean DEFAULT false NOT NULL,
    "trip_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "resource_type" "public"."resource_type" DEFAULT 'USER'::"public"."resource_type" NOT NULL,
    "profile_id" "uuid"
);

ALTER TABLE "public"."todos" OWNER TO "postgres";

ALTER TABLE "public"."todos" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."todos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."trip_details" (
    "id" bigint NOT NULL,
    "title" character varying,
    "url" character varying,
    "value" character varying,
    "type" "public"."trip_details_type" DEFAULT 'HIKE'::"public"."trip_details_type" NOT NULL,
    "trip_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."trip_details" OWNER TO "postgres";

ALTER TABLE "public"."trip_details" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."trip_details_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."trip_friends" (
    "id" bigint NOT NULL,
    "trip_id" bigint,
    "accepted_invite_on" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "public"."trip_friend_status" DEFAULT 'PENDING'::"public"."trip_friend_status" NOT NULL,
    "profile_id" "uuid",
    "invited_by_id" "uuid",
    "invite_token" character varying,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."trip_friends" OWNER TO "postgres";

ALTER TABLE "public"."trip_friends" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."trip_friends_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."trip_packs" (
    "id" bigint NOT NULL,
    "trip_id" bigint,
    "pack_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid"
);

ALTER TABLE "public"."trip_packs" OWNER TO "postgres";

ALTER TABLE "public"."trip_packs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."trip_packs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."trips" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying,
    "description" "text",
    "starting_point" character varying,
    "ending_point" character varying,
    "starting_date" timestamp with time zone,
    "ending_date" timestamp with time zone,
    "slug" character varying,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid"
);

ALTER TABLE "public"."trips" OWNER TO "postgres";

ALTER TABLE "public"."trips" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."trips_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile_answers" (
    "id" bigint NOT NULL,
    "answer_id" bigint,
    "profile_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "poll_id" bigint
);

ALTER TABLE "public"."profile_answers" OWNER TO "postgres";

ALTER TABLE "public"."profile_answers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_answers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "trail_name" "text",
    "image" "text",
    "role" "public"."user_role" DEFAULT 'USER'::"public"."user_role",
    "measuring_system" "public"."measuring_system" DEFAULT 'IMPERIAL'::"public"."measuring_system",
    "onboard_date" timestamp with time zone,
    "address_1" "text",
    "address_2" "text",
    "city" "text",
    "state" "text",
    "country" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "location" "jsonb",
    "slug" "text" NOT NULL UNIQUE
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."category_items"
    ADD CONSTRAINT "category_items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."onboarding_steps"
    ADD CONSTRAINT "onboarding_completion_pkey" PRIMARY KEY ("profile_id", "page");

ALTER TABLE ONLY "public"."packs"
    ADD CONSTRAINT "packs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."packs"
    ADD CONSTRAINT "packs_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."polls"
    ADD CONSTRAINT "polls_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."shopping_list_items"
    ADD CONSTRAINT "shopping_list_items_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."shopping_list_items"
ADD CONSTRAINT shopping_list_profile_id_check CHECK (
  (resource_type = 'USER' AND profile_id IS NOT NULL) OR
  resource_type = 'GROUP'
);

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."todos"
ADD CONSTRAINT todos_profile_id_check CHECK (
  (resource_type = 'USER' AND profile_id IS NOT NULL) OR
  resource_type = 'GROUP'
);

ALTER TABLE ONLY "public"."trip_details"
    ADD CONSTRAINT "trip_details_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."trip_friends"
    ADD CONSTRAINT "trip_friends_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."trip_packs"
    ADD CONSTRAINT "trip_packs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."profile_answers"
    ADD CONSTRAINT "profile_answers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."friend_invitations" ADD CONSTRAINT "friend_invitations_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles" ("id") ON DELETE SET NULL;
ALTER TABLE "public"."friend_invitations" ADD CONSTRAINT "friend_invitations_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles" ("id") ON DELETE SET NULL;
ALTER TABLE "public"."friend_invitations" ADD CONSTRAINT "friend_invitations_status_check" CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'));

ALTER TABLE "public"."friends" ADD CONSTRAINT "unique_friendship" UNIQUE ("friend_id", "profile_id");

CREATE OR REPLACE TRIGGER "generate_slug_for_categories" BEFORE INSERT ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."generate_slug"();

CREATE OR REPLACE TRIGGER "generate_slug_for_items" BEFORE INSERT ON "public"."items" FOR EACH ROW EXECUTE FUNCTION "public"."generate_slug"();

CREATE OR REPLACE TRIGGER "generate_slug_for_packs" BEFORE INSERT ON "public"."packs" FOR EACH ROW EXECUTE FUNCTION "public"."generate_slug"();

CREATE OR REPLACE TRIGGER "generate_slug_for_trips" BEFORE INSERT ON "public"."trips" FOR EACH ROW EXECUTE FUNCTION "public"."generate_slug"();

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."answers" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."category_items" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."friends" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."items" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."onboarding_steps" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."packs" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."polls" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."questions" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."replies" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."shopping_list_items" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."todos" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."trip_details" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."trip_friends" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."trip_packs" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."trips" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."profile_answers" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_new_user" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE PROCEDURE "public"."handle_new_user"();

ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."packs"("id");

ALTER TABLE ONLY "public"."category_items"
    ADD CONSTRAINT "category_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");

ALTER TABLE ONLY "public"."category_items"
    ADD CONSTRAINT "category_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."packs"("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."onboarding_steps"
    ADD CONSTRAINT "onboarding_steps_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."packs"
    ADD CONSTRAINT "packs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."polls"
    ADD CONSTRAINT "polls_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");

ALTER TABLE ONLY "public"."polls"
    ADD CONSTRAINT "polls_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");

ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id");

ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."shopping_list_items"
    ADD CONSTRAINT "shopping_list_items_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");

ALTER TABLE ONLY "public"."shopping_list_items"
    ADD CONSTRAINT "shopping_list_items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");

ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."trip_details"
    ADD CONSTRAINT "trip_details_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");

ALTER TABLE ONLY "public"."trip_friends"
    ADD CONSTRAINT "trip_friends_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");

ALTER TABLE ONLY "public"."trip_friends"
    ADD CONSTRAINT "trip_friends_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."trip_friends"
    ADD CONSTRAINT "trip_friends_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."trip_packs"
    ADD CONSTRAINT "trip_packs_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."packs"("id");

ALTER TABLE ONLY "public"."trip_packs"
    ADD CONSTRAINT "trip_packs_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");

ALTER TABLE ONLY "public"."trip_packs"
    ADD CONSTRAINT "trip_packs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."profile_answers"
    ADD CONSTRAINT "profile_answers_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."answers"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profile_answers"
    ADD CONSTRAINT "profile_answers_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profile_answers"
    ADD CONSTRAINT "profile_answers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Allow public read-only access." ON "public"."prices" FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access." ON "public"."products" FOR SELECT USING (true);

CREATE POLICY "Can only view own subs data." ON "public"."subscriptions" FOR SELECT USING (("auth"."uid"() = "profile_id"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."categories" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."category_items" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."customers" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."friends" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."items" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."notifications" USING (("auth"."uid"() = "profile_id")) WITH CHECK (("auth"."uid"() = "profile_id"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."packs" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."shopping_list_items" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."todos" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."trip_details" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."trip_friends" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."trip_packs" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Enable CRUD for authenticated profiles only" ON "public"."trips" WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

-- Policy to allow authenticated users to read from any folder in the 'avatars' bucket
CREATE POLICY "Enable READ for any logged in users" 
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');

-- Policy to allow a user to insert, update, and delete in their own folder in the 'avatars' bucket
CREATE POLICY "Enable full CRUD for users that match directory"
ON storage.objects FOR INSERT, UPDATE, DELETE USING (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
);

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."generate_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_slug"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) TO "anon";
GRANT ALL ON FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) TO "authenticated";
GRANT ALL ON FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_category_and_item"("p_name" TEXT, "p_pack_id" BIGINT, "p_items" JSONB) TO "anon";
GRANT ALL ON FUNCTION "public"."create_category_and_item"("p_name" TEXT, "p_pack_id" BIGINT, "p_items" JSONB) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_category_and_item"("p_name" TEXT, "p_pack_id" BIGINT, "p_items" JSONB) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_positions"(records public.category_item_position[]) TO "anon";
GRANT ALL ON FUNCTION "public"."update_positions"(records public.category_item_position[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_positions"(records public.category_item_position[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_poll"("trip_id" bigint, "question" text, "answers" text[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_poll"("trip_id" bigint, "question" text, "answers" text[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_poll"("trip_id" bigint, "question" text, "answers" text[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_poll"("poll_id" bigint, "question" text, "answers" text[]) TO "anon";
GRANT ALL ON FUNCTION "public"."update_poll"("poll_id" bigint, "question" text, "answers" text[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_poll"("poll_id" bigint, "question" text, "answers" text[]) TO "service_role";

GRANT ALL ON TABLE "public"."answers" TO "anon";
GRANT ALL ON TABLE "public"."answers" TO "authenticated";
GRANT ALL ON TABLE "public"."answers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."answers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."answers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."answers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."category_items" TO "anon";
GRANT ALL ON TABLE "public"."category_items" TO "authenticated";
GRANT ALL ON TABLE "public"."category_items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."category_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_items_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";

GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";

GRANT ALL ON SEQUENCE "public"."friends_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."friends_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."friends_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."items" TO "anon";
GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."onboarding_steps" TO "anon";
GRANT ALL ON TABLE "public"."onboarding_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."onboarding_steps" TO "service_role";

GRANT ALL ON TABLE "public"."packs" TO "anon";
GRANT ALL ON TABLE "public"."packs" TO "authenticated";
GRANT ALL ON TABLE "public"."packs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."packs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."packs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."packs_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."polls" TO "anon";
GRANT ALL ON TABLE "public"."polls" TO "authenticated";
GRANT ALL ON TABLE "public"."polls" TO "service_role";

GRANT ALL ON SEQUENCE "public"."polls_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."polls_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."polls_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."replies" TO "anon";
GRANT ALL ON TABLE "public"."replies" TO "authenticated";
GRANT ALL ON TABLE "public"."replies" TO "service_role";

GRANT ALL ON SEQUENCE "public"."replies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."replies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."replies_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."shopping_list_items" TO "anon";
GRANT ALL ON TABLE "public"."shopping_list_items" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_list_items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."shopping_list_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shopping_list_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shopping_list_items_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."todos" TO "anon";
GRANT ALL ON TABLE "public"."todos" TO "authenticated";
GRANT ALL ON TABLE "public"."todos" TO "service_role";

GRANT ALL ON SEQUENCE "public"."todos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."todos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."todos_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."trip_details" TO "anon";
GRANT ALL ON TABLE "public"."trip_details" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_details" TO "service_role";

GRANT ALL ON SEQUENCE "public"."trip_details_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trip_details_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trip_details_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."trip_friends" TO "anon";
GRANT ALL ON TABLE "public"."trip_friends" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_friends" TO "service_role";

GRANT ALL ON SEQUENCE "public"."trip_friends_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trip_friends_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trip_friends_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."trip_packs" TO "anon";
GRANT ALL ON TABLE "public"."trip_packs" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_packs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."trip_packs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trip_packs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trip_packs_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."trips" TO "anon";
GRANT ALL ON TABLE "public"."trips" TO "authenticated";
GRANT ALL ON TABLE "public"."trips" TO "service_role";

GRANT ALL ON SEQUENCE "public"."trips_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trips_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trips_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile_answers" TO "anon";
GRANT ALL ON TABLE "public"."profile_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_answers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_answers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_answers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_answers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
