import React from 'react'
import { assets, linkSections } from '../assets/assets';

const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary text-white">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="dummyLogoColored" />
                    <p className="max-w-[410px] mt-6">
                        SbumFood – Mang đến trải nghiệm ẩm thực nhanh chóng, tiện lợi và chất lượng mỗi ngày!
                    </p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-white md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={section.hrefs[i]} className="hover:underline transition cursor-pointer">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-white bg-[#d11633]">
                © {new Date().getFullYear()} SbumFood
            </p>
        </div>
    );
};

export default Footer
