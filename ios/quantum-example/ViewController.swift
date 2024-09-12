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
		// Do any additional setup after loading the view.
		
		quantum = Quantum(view: webView, controller: self)
		webView.load(URLRequest(url: URL(string: "http://localhost:3000")!))
	}
}

