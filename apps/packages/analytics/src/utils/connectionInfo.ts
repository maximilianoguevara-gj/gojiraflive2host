export interface ConnectionInfo {
  downlink: number;
  effectiveType: string;
  rtt: number;
  type: string;
}

export function getConnectionInfo(): ConnectionInfo | null {
  if ('connection' in navigator && navigator.connection instanceof NetworkInformation) {
    return {
      downlink: navigator.connection.downlink,
      effectiveType: navigator.connection.effectiveType,
      rtt: navigator.connection.rtt,
      type: navigator.connection.type,
    };
  }
  return null;
}

export function isConnectionSlow(): boolean {
  const connectionInfo = getConnectionInfo();
  if (connectionInfo) {
    if (connectionInfo.effectiveType === 'slow-2g' || connectionInfo.rtt > 1000) {
      return true;
    }
  }
  return false;
}
