/* eslint-disable sonarjs/no-duplicate-string */
import * as React from 'react';
import {useEffect, useRef} from 'react';
import {SubApp} from '../../../system/sub-app.component';
import './home.less';

type THomePageCardsProps = {
	cards: Array<string>
};

export const HomePageCards: React.FC<THomePageCardsProps> = (props: THomePageCardsProps) => {
	const destroying = useRef(false);

	useEffect(() => {
		return () => {
			destroying.current = true;
		};
	}, []);

	if (destroying.current) {
		return null;
	}

	const triples = [];
	for (let i = 0; i < props.cards.length; i += 3) {
		const c1 = i < props.cards.length ? props.cards[i] : null;
		const c2 = i + 1 < props.cards.length ? props.cards[i + 1] : null;
		const c3 = i + 2 < props.cards.length ? props.cards[i + 2] : null;

		triples.push(<div className={'app-home-cards'} key={'triple_' + c1 + i.toString()}>
				{c1 && <SubApp
					key={c1}
					subappView={c1}
					className={'app-home-card'}
					silent={true}
				/>
				}
				{c2 && <SubApp
					key={c2}
					subappView={c2}
					className={'app-home-card'}
					silent={true}
				/>
				}
				{c3 && <SubApp
					key={c3}
					subappView={c3}
					className={'app-home-card'}
					silent={true}
				/>
				}
			</div>
		);
	}

	return <div className={'app-layout home-page'}>
		<h1>Welcome to UAC | TMP!</h1>

		{triples}
	</div>;
};
