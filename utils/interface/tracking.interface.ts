export interface PageviewInterface {
  id: string;
  os: string;
  url: string;
  device: string;
  browser: string;
  country: string;
  site_id: string;
  referrer: string;
  timestamp: string;
  ip_address: string | null;
  user_agent: string;
}

export interface SiteInterface {
  id: string;
  user_id: string;
  domain: string;
  timezone: string;
  name: string;
  created_at: string;
  pageviews: PageviewInterface[];
}