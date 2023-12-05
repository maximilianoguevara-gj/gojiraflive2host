export interface DataLogElastic {
  storeId: string;
  companyId: string;
  buyerId: string;
  productName: string | undefined;
  utmParams: {
    utmSource: string;
    utmMedium: string;
    utmCampaing: string;
  };
  device: string;
  eventType: string;
  event: string;
  connectionInfo?: {
    downlink: string;
    effectiveType: string;
    rtt: string;
    type: string;
  };
}
