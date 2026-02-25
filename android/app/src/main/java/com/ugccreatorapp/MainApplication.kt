package com.ugccreatorapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.runtime.hermes.HermesInstance

class MainApplication : Application(), ReactApplication {

  @Suppress("DEPRECATION")
  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages() = PackageList(this@MainApplication).packages
      override fun getJSMainModuleName() = "index"
      override fun getUseDeveloperSupport() = com.facebook.react.common.build.ReactBuildConfig.DEBUG
      override val isNewArchEnabled = true
      override val isHermesEnabled = true
    }

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
      jsRuntimeFactory = HermesInstance(),
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}