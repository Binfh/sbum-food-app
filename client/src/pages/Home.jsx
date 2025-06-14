import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import SubBanner from '../components/SubBanner'
import NewLetter from '../components/NewLetter'

const Home = () => {
  return (
    <div className='mt-32'>
        <MainBanner />
        <Categories />
        <BestSeller />
        <SubBanner />
        <NewLetter />
    </div>
  )
}

export default Home