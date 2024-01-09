#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import "RNSplashScreen.h"
#import <React/RCTLinkingManager.h>
#import <CodePush/CodePush.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"UGCCreatorApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // fill screen with our own colour
    UIView *colourView = [[UIView alloc]initWithFrame:self.window.frame];
    colourView.backgroundColor = [UIColor whiteColor];
    colourView.tag = 1234;
    colourView.alpha = 0;
    [self.window addSubview:colourView];
    [self.window bringSubviewToFront:colourView];
    // fade in the view
    [UIView animateWithDuration:0.5 animations:^{
        colourView.alpha = 1;
    }];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // grab a reference to our coloured view
    UIView *colourView = [self.window viewWithTag:1234];
    // fade away colour view from main view
    [UIView animateWithDuration:0.5 animations:^{
        colourView.alpha = 0;
    } completion:^(BOOL finished) {
        // remove when finished fading
        [colourView removeFromSuperview];
    }];
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
