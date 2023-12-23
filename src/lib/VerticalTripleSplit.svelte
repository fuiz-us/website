<div style:height="100%" style:display="grid" style:grid-template-rows="auto 1fr auto">
	<slot name="top" />
	<div
		style:flex="1"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:justify-content="center"
		style:position="relative"
	>
		<slot name="center" />
	</div>
	<slot name="bottom" />
</div>
