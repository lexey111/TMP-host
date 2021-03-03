import * as React from 'react';
import {useEffect, useRef} from 'react';
import {ITmpManager} from 'TMPCore/index';

export type TSubAppProps = {
	view: string
};

let id = 0;

export const SubApp: React.FC<TSubAppProps> = (props: TSubAppProps) => {
	const ref = useRef<HTMLDivElement>();

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,prefer-destructuring
		const TmpManager: ITmpManager = window['TmpManager'];

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
		TmpManager
			.mount(props.view, ref.current.id)
			.catch(err => {
				console.log('Error on mounting', props.view);
				console.log(err);
			});

		return () => {
			TmpManager.unmount(props.view, ref.current.id);
		};
	}, [ref]);

	return <div ref={ref} id={'tmp-container-' + (id++).toString()}>
	</div>;
};
