import { useStore } from 'state';
import { useAuth } from '@gojiraf/auth';
import { ConnectionInfo, getConnectionInfo } from '../utils/connectionInfo';
import { DataLogElastic } from '../interfaces/dataLogElastic';

const getURLParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    utmSource: searchParams.get('utm_source'),
    utmMedium: searchParams.get('utm_medium'),
    utmCampaing: searchParams.get('utm_campaign'),
  };
};
const getDeviceType = () => (window.innerWidth >= 768 ? 'desktop' : 'mobile');

let downlink: number | undefined;
let effectiveType: string | undefined;
let rtt: number | undefined;
let type: string | undefined;

const conecctionInfo: ConnectionInfo | null = getConnectionInfo();

if (conecctionInfo !== null) {
  downlink = conecctionInfo.downlink;
  effectiveType = conecctionInfo.effectiveType;
  rtt = conecctionInfo.rtt;
  type = conecctionInfo.type;
}

export const useElasticEventTracker = () => {
  const store = useStore((storeState: any) => storeState.store);
  const { user } = useAuth();
  const sendEventPostToElastic = (eventType: string, event: string, productName: string) => {
    if (!store.storeConfigurations?.sendLogToElastic) return;
    if (!store.storeConfigurations?.sendLogToElastic[eventType]) return;

    const postData: DataLogElastic = {
      storeId: store.id!,
      companyId: store.companyId!,
      buyerId: user.id,
      productName: productName ?? undefined,
      utmParams: {
        utmSource: getURLParams().utmSource || '',
        utmMedium: getURLParams().utmMedium || '',
        utmCampaing: getURLParams().utmCampaing || '',
      },
      device: getDeviceType(),
      eventType: eventType || event,
      event,
    };

    if (eventType === 'errors') {
      postData.connectionInfo = {
        downlink: `${downlink} Mbps`,
        effectiveType: `${effectiveType}`,
        rtt: `${rtt} ping`,
        type: `${type}`,
      };
    }

    const urlApi = process.env.REACT_APP_CORE_URL;
    const userToken = user.tokens?.accessToken!;
    fetch(`${urlApi}/api/userLogs/elasticLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(postData),
    });
  };
  return { sendEventPostToElastic };
};
