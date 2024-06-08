import React from 'react'
import '../styles/table.scss'
import Schedule from '../Schedule'

function Table() {
  return (
    <div className="area area--table">

      <div className="titlehead">расписание</div>

      <div className="tableforschedure">

        <div className="tabletop">
          <div className="arrowscalendar">
            <div className="arrowButton">left</div>
            <div className="arrowButton">right</div>
          </div>
          <div className="shittycalendar">weeks</div>
        </div>

        <div className="blyattable">

          полная хуйся блять

        </div>

      </div>

    </div>
  )
}

export default Table