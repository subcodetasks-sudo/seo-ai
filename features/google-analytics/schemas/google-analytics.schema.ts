import { z } from "zod";

const envelope = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
  });

export const gaStatusResponseSchema = envelope(
  z.object({
    connected: z.boolean(),
    property_id: z.string().nullable(),
    property_name: z.string().nullable(),
  }),
);

export const gaConnectResponseSchema = envelope(
  z.object({
    auth_url: z.string(),
  }),
);

export const gaCallbackResponseSchema = envelope(
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
);

export const gaDisconnectResponseSchema = envelope(
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
);

export const gaPropertiesResponseSchema = envelope(
  z.object({
    properties: z.array(
      z.object({
        property_id: z.string(),
        display_name: z.string(),
        website_url: z.string().nullable().optional(),
      }),
    ),
  }),
);

export const gaSelectPropertyResponseSchema = envelope(
  z.object({
    success: z.boolean(),
    property_id: z.string(),
  }),
);

export const gaOverviewResponseSchema = envelope(
  z.object({
    sessions: z.number(),
    users: z.number(),
    new_users: z.number(),
    active_users: z.number(),
    bounce_rate: z.number(),
    avg_session_duration: z.number(),
    page_views: z.number(),
  }),
);

export const gaTrafficSourcesResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        channel: z.string(),
        sessions: z.number(),
        users: z.number(),
        bounce_rate: z.number(),
      }),
    ),
    total_sessions: z.number(),
  }),
);

export const gaPagesResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        page_path: z.string(),
        page_title: z.string(),
        views: z.number(),
        unique_views: z.number(),
        avg_time_on_page: z.number(),
        bounce_rate: z.number(),
      }),
    ),
    total: z.number(),
  }),
);

export const gaAudienceResponseSchema = envelope(
  z.object({
    countries: z.array(
      z.object({
        country: z.string(),
        sessions: z.number(),
        users: z.number(),
      }),
    ),
    total_sessions: z.number(),
  }),
);

export const gaEventsResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        event_name: z.string(),
        event_count: z.number(),
        users: z.number(),
      }),
    ),
    total_events: z.number(),
  }),
);

export const gaConversionsResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        event_name: z.string(),
        conversions: z.number(),
        conversion_rate: z.number(),
      }),
    ),
    total_conversions: z.number(),
  }),
);

export const gaEcommerceResponseSchema = envelope(
  z.object({
    total_revenue: z.number(),
    transactions: z.number(),
    avg_order_value: z.number(),
    ecommerce_conversion_rate: z.number(),
    items_purchased: z.number(),
  }),
);
