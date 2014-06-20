<p>I have also tech edited and contributed in various other ways to the following books: <a href="http://amzn.to/SWbEfx"><cite>Designing with Web Standards</cite></a> by Jeffrey Zeldman, <a href="http://amzn.to/1qvIPFd"><cite>Learning Web Design</cite></a> by Jennifer Robbins, <a href="http://amzn.to/1ioxDIb"><cite>DOM Scripting</cite></a> and <a href="http://amzn.to/1oKNlQD"><cite>Bulletproof Ajax</cite></a> by Jeremy Keith, <a href="http://amzn.to/1ioxape"><cite>Transcending CSS: The Fine Art of Web Design</cite></a> by Andy Clarke and Molly Holzschlag, <a href="http://amzn.to/1oKO6ZW"><cite>Designing Web Navigation</cite></a> by James Kalbach, <a href="http://amzn.to/1oKW5GA"><cite>Practical Prototype and script.aculo.us</cite></a> by Andrew Dupont, <a href="http://amzn.to/UQqFRT"><cite>ppk on JavaScript</cite></a> by Peter-Paul Koch, and <a href="http://amzn.to/1qiJrM6"><cite>Pragmatic Guide to JavaScript</cite></a> by Christophe Porteneuve.</p>

{% comment %}
<p>I have also tech edited and contributed in various other ways to the following books: 
	{% for book in site.book_contributions %}
		{% if forloop.index == forloop.length %}
			and
		{% endif %}
		<a href="{{ book.url }}">{{ book.title }}</a> by
		{{ book.author }}{% if forloop.index == forloop.length %}.{% else %},{% endif %}
	{% endfor %}
</p>
{% endcomment %}

<p>My work has also been cited in <a href="http://amzn.to/1iKVxIH"><cite>Responsive Web Design with HTML5 and CSS3</cite></a> by Ben Frain, <a href="http://amzn.to/1lETHNH"><cite>Web Standards Creativity</cite></a> by Andy Budd, et al, and <a href="http://amzn.to/1iKWQao"><cite>Pro CSS Techniques</cite></a> by Dan Rubin, Ian Lloyd, and Jeff Croft.</p>

{% comment %}
<p>My work has also been cited in
	{% for book in site.book_citations %}
		{% if forloop.index == forloop.length %}
			and
		{% endif %}
		<a href="{{ book.url }}">{{ book.title }}</a> by
		{{ book.author }}{% if forloop.index == forloop.length %}.{% else %},{% endif %}
	{% endfor %}
</p>
{% endcomment %}