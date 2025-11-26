import Capacitor

@objc(WebViewPlugin)
public class WebViewPlugin: CAPPlugin {
	@objc override public func load() {
		self.bridge?.webView?.scrollView.bounces = true
	}
}