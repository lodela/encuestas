import { CapacitorConfig } from '@capacitor/cli';



const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'gasApp',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    }
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: false,
      backgroundColor: "#ffffff" // YOUR SPLASH SCREEN MAIN COLOR
    }
  }
};

export default config;
