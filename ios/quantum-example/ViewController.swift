//
//  ViewController.swift
//  quantum-example
//
//  Created by Erik Sargent on 9/12/24.
//

import UIKit
import WebKit

import QuantumIOS


class ViewController: UIViewController {
	@IBOutlet weak var webView: WKWebView!
	var quantum: Quantum?
	
	
	override func viewDidLoad() {
		super.viewDidLoad()
		
        // Quantum takes two parameters.
        // 1. A WebView that uses the qauntum-js package to manage browsers (see example webapp)
        // 2. A UIViewController to present the browsers on top of
        // The WebView could be an existing web application you present to your users inside of your native app
        // or a hidden WebView that is used to house a web application that uses quantum-js to manage browsers
		quantum = Quantum(view: webView, controller: self)
		webView.load(URLRequest(url: URL(string: "http://localhost:3000")!))
	}
}
