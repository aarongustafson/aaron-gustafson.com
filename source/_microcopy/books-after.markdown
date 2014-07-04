<p>{{ site.data.microcopy.books.editing_intro }}
	{% for book in site.data.book-contributions %}
		{% if forloop.index == forloop.length %}
			and
		{% endif %}
		<a href="{{ book.url }}">{{ book.title }}</a> by
		{{ book.author }}{% if forloop.index == forloop.length %}.{% else %},{% endif %}
	{% endfor %}
</p>