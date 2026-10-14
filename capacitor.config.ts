import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.engageflow.app',
  appName: 'EngageFlow AI',
  // Angular's application builder outputs to dist/<project>/browser, not
  // dist/ directly — this must match angular.json's outputPath + "/browser".
  webDir: 'dist/ng-tailadmin/browser',
};

export default config;
