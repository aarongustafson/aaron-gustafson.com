<p>My work has also been cited in a few books: 
	{% for book in site.data.book-citations %}
		{% if forloop.index == forloop.length %}
			and
		{% endif %}
		<a href="{{ book.url }}">{{ book.title }}</a> by
		{{ book.author }}{% if forloop.index == forloop.length %}.{% else %},{% endif %}
	{% endfor %}
</p>