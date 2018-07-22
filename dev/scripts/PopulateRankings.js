import React from 'react';

const PopulateRankings = (props) => {
    return (
        <tr>
            <th>
                {props.index + 1}
            </th>
            <td>
                <img src="flags/blank.gif" className={`flag flag-${props.countryShort}`} alt={props.countryLong} title={props.countryLong}/> {props.teamName} {props.playerName}
            </td>
            <td className="main-char">
                <img src={`img/${props.mainShort}.png`} alt={props.mainLong} title={props.mainLong}/>
            </td>
            <td>
                {props.elo}
            </td>
        </tr>
    )
}

export default PopulateRankings;