import { z } from "zod";

const envelope = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
  });

export const scStatusResponseSchema = envelope(
  z.object({
    connected: z.boolean(),
    site_url: z.string().nullable(),
  }),
);

export const scConnectResponseSchema = envelope(
  z.object({
    auth_url: z.string(),
  }),
);

export const scCallbackResponseSchema = envelope(
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
);

export const scDisconnectResponseSchema = envelope(
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
);

export const scSitesResponseSchema = envelope(
  z.object({
    sites: z.array(
      z.object({
        site_url: z.string(),
        permission_level: z.string(),
      }),
    ),
  }),
);

export const scSelectSiteResponseSchema = envelope(
  z.object({
    success: z.boolean(),
    site_url: z.string(),
  }),
);

export const scOverviewResponseSchema = envelope(
  z.object({
    clicks: z.number(),
    impressions: z.number(),
    ctr: z.number(),
    avg_position: z.number(),
  }),
);

export const scQueriesResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        query: z.string(),
        clicks: z.number(),
        impressions: z.number(),
        ctr: z.number(),
        avg_position: z.number(),
      }),
    ),
    total: z.number(),
  }),
);

export const scPagesResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        page: z.string(),
        clicks: z.number(),
        impressions: z.number(),
        ctr: z.number(),
        avg_position: z.number(),
      }),
    ),
    total: z.number(),
  }),
);

export const scCountriesResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        country: z.string(),
        clicks: z.number(),
        impressions: z.number(),
        ctr: z.number(),
        avg_position: z.number(),
      }),
    ),
    total: z.number(),
  }),
);

export const scDevicesResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        device: z.string(),
        clicks: z.number(),
        impressions: z.number(),
        ctr: z.number(),
        avg_position: z.number(),
      }),
    ),
    total: z.number(),
  }),
);

export const scSitemapsResponseSchema = envelope(
  z.object({
    items: z.array(
      z.object({
        path: z.string(),
        is_pending: z.boolean(),
        is_sitemaps_index: z.boolean(),
        last_submitted: z.string().nullable(),
        last_downloaded: z.string().nullable(),
        warnings: z.number(),
        errors: z.number(),
        urls_submitted: z.number(),
        urls_indexed: z.number(),
      }),
    ),
    total: z.number(),
  }),
);
