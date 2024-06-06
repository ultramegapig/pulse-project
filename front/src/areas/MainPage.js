import React, { useEffect, useState } from 'react'
import '../styles/mainpage.scss'


function MainPage() {

  return (
    <div className='area'>
      
      <div className="mainPageLeft">

        <div className="titleHead">
          <div>мои тесты</div>
          <button className="arrowButton">
            button
          </button>
        </div>

        <div className="testBlocksList">
          <div className="testBlock color-box">hui</div>
          <div className="testBlock random-colored-div">pizda</div>
          <div className="testBlock random-colored-div">pidarasina</div>
        </div>

      </div>

      <div className="mainPageRight">
        right
      </div>

    </div>
  )
}

export default MainPage