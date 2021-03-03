import * as React from 'react';

export type TSubAppProps = {
	name: string
};

export const SubApp: React.FC<TSubAppProps> = (props: TSubAppProps) => {
	return <>
		<h2>Some content</h2>
		<p>{props.name}</p>
	</>;
};
