---
title: "Using Mozilla’s Observatory to Improve Website Security"
date: 2017-03-13 10:35:34 -04:00
comments: true
tags: []
description: ""
---



<table class="table table-striped table-condensed pull-left scan-summary-table">
                        <tbody><tr>
                            <th>Test</th>
                            <th>Pass</th>
                            <th>Score</th>
                            <th>Explanation</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#Content_Security_Policy">Content Security Policy</a></td>
                            <td class="glyphicon glyphicon-remove" id="tests-content-security-policy-pass" aria-hidden="true" aria-label="Fail"></td>
                            <td id="tests-content-security-policy-score">-20</td>
                            <td id="tests-content-security-policy-score-description">Content Security Policy (CSP) implemented unsafely.<br><br>This includes <code>'unsafe-inline'</code> or <code>data:</code> inside <code>script-src</code>, overly broad sources such as https: inside <code>object-src</code> or <code>script-src</code>, or not restricting the sources for <code>object-src</code> or <code>script-src</code>.</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="Content Security Policy (CSP) can prevent a wide range of cross-site scripting (XSS) and clickjacking attacks against your website." data-original-title="Content Security Policy"></span></td>
                        </tr>
                        
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#Cookies">Cookies</a></td>
                            <td class="glyphicon glyphicon-minus" id="tests-cookies-pass" aria-hidden="true" aria-label="Not Applicable / Optional"></td>
                            <td id="tests-cookies-score">0</td>
                            <td id="tests-cookies-score-description">No cookies detected</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="Using cookies attributes such as Secure and HttpOnly can protect users from having their personal information stolen." data-original-title="Cookies"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#Cross-origin_Resource_Sharing">Cross-origin Resource Sharing</a></td>
                            <td class="glyphicon glyphicon-ok" id="tests-cross-origin-resource-sharing-pass" aria-hidden="true" aria-label="Pass"></td>
                            <td id="tests-cross-origin-resource-sharing-score">0</td>
                            <td id="tests-cross-origin-resource-sharing-score-description">Content is not visible via cross-origin resource sharing (CORS) files or headers</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="Incorrectly configured CORS settings can allow foreign sites to read your site's contents, possibly allowing them access to private user information." data-original-title="Cross-origin Resource Sharing"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#HTTP_Public_Key_Pinning">HTTP Public Key Pinning</a></td>
                            <td class="glyphicon glyphicon-ok" id="tests-public-key-pinning-pass" aria-hidden="true" aria-label="Pass"></td>
                            <td id="tests-public-key-pinning-score">+1</td>
                            <td id="tests-public-key-pinning-score-description">HTTP Public Key Pinning (HPKP) header set to less than 15 days (1296000)</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="HTTP Public Key Pinning (HPKP) binds a site to a specific combination of certificate authorities and/or keys, protecting against the unauthorized issuance of certificates." data-original-title="HTTP Public Key Pinning"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#HTTP_Strict_Transport_Security">HTTP Strict Transport Security</a></td>
                            <td class="glyphicon glyphicon-ok" id="tests-strict-transport-security-pass" aria-hidden="true" aria-label="Pass"></td>
                            <td id="tests-strict-transport-security-score">+5</td>
                            <td id="tests-strict-transport-security-score-description">Preloaded via the HTTP Strict Transport Security (HSTS) preloading process</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="HTTP Strict Transport Security (HSTS) instructs web browsers to visit your site only over HTTPS." data-original-title="HTTP Strict Transport Security"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#HTTP_Redirections">Redirection</a></td>
                            <td class="glyphicon glyphicon-ok" id="tests-redirection-pass" aria-hidden="true" aria-label="Pass"></td>
                            <td id="tests-redirection-score">0</td>
                            <td id="tests-redirection-score-description">All hosts redirected to are in the HTTP Strict Transport Security (HSTS) preload list</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="Properly configured redirections from HTTP to HTTPS allow browsers to correctly apply HTTP Strict Transport Security (HSTS) settings." data-original-title="Redirection"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#Referrer_Policy">Referrer Policy</a></td>
                            <td class="glyphicon glyphicon-minus" id="tests-referrer-policy-pass" aria-hidden="true" aria-label="Not Applicable / Optional"></td>
                            <td id="tests-referrer-policy-score">0</td>
                            <td id="tests-referrer-policy-score-description">Referrer-Policy header not implemented (optional)</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="Referrer Policy can protect the privacy of your users by restricting the contents of the HTTP Referer header." data-original-title="Referrer Policy"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#Subresource_Integrity">Subresource Integrity</a></td>
                            <td class="glyphicon glyphicon-minus" id="tests-subresource-integrity-pass" aria-hidden="true" aria-label="Not Applicable / Optional"></td>
                            <td id="tests-subresource-integrity-score">0</td>
                            <td id="tests-subresource-integrity-score-description">Subresource Integrity (SRI) not implemented, but all scripts are loaded from a similar origin</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="Subresource Integrity protects against JavaScript files and stylesheets stored on content delivery networks (CDNs) from being maliciously modified." data-original-title="Subresource Integrity"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#X-Content-Type-Options">X-Content-Type-Options</a></td>
                            <td class="glyphicon glyphicon-remove" id="tests-x-content-type-options-pass" aria-hidden="true" aria-label="Fail"></td>
                            <td id="tests-x-content-type-options-score">-5</td>
                            <td id="tests-x-content-type-options-score-description">X-Content-Type-Options header not implemented</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="X-Content-Type-Options instructs browsers to not guess the MIME types of files that the web server is delivering." data-original-title="X-Content-Type-Options"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#X-Frame-Options">X-Frame-Options</a></td>
                            <td class="glyphicon glyphicon-remove" id="tests-x-frame-options-pass" aria-hidden="true" aria-label="Fail"></td>
                            <td id="tests-x-frame-options-score">-20</td>
                            <td id="tests-x-frame-options-score-description">X-Frame-Options (XFO) header not implemented</td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="X-Frame-Options controls whether your site can be framed, protecting against clickjacking attacks. It has been superseded by Content Security Policy's <code>frame-ancestors</code> directive, but should still be used for now." data-original-title="X-Frame-Options"></span></td>
                        </tr>
                        <tr>
                            <td><a href="https://wiki.mozilla.org/Security/Guidelines/Web_Security#X-XSS-Protection">X-XSS-Protection</a></td>
                            <td class="glyphicon glyphicon-ok" id="tests-x-xss-protection-pass" aria-hidden="true" aria-label="Pass"></td>
                            <td id="tests-x-xss-protection-score">0</td>
                            <td id="tests-x-xss-protection-score-description">X-XSS-Protection header set to <code>"1; mode=block"</code></td>
                            <td><span class="glyphicon glyphicon-info-sign" data-toggle="popover" title="" data-content="X-XSS-Protection protects against reflected cross-site scripting (XSS) attacks in IE and Chrome, but has been superseded by Content Security Policy. It can still be used to protect users of older web browsers." data-original-title="X-XSS-Protection"></span></td>
                        </tr>
                    </tbody></table>
