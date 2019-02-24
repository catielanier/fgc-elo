import React from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(fab);

const PopulateRankings = (props) => {
    return (
        <tr>
            <th>
                {props.index + 1}
            </th>
            <td className="player-name">
    <img src="flags/blank.gif" className={`flag flag-${props.countryShort}`} alt={props.countryLong} title={props.countryLong} /> <span className="team-name">{props.teamName}</span> {props.playerName} {props.twitterHandle != undefined ? <a href={`http://twitter.com/${props.twitterHandle}`} target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>  : null} {props.twitchChannel != undefined ? <a href={`http://twitch.tv/${props.twitchChannel}`} target="_blank"><FontAwesomeIcon icon={['fab', 'twitch']} /></a> : null}
            </td>
            <td className="main-char text-center">
                <img src={`img/${props.mainShort}.png`} alt={props.mainLong} title={props.mainLong}/>
            </td>
            <td className="score text-center">
                {props.elo}
            </td>
        </tr>
    )
}

export default PopulateRankings;