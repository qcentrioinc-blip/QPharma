import React from "react";

const Free: React.FC = () => {
    return (
        <section className="w-full bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[14px] bg-[#17cf19] shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-[40px] -top-[34px] h-[86px] w-[180px] rounded-full bg-white/10 blur-[0.5px]" />
                    <div className="absolute left-[32%] top-[-16px] h-[96px] w-[120px] rounded-full bg-[#0e9f12]/60" />
                    <div className="absolute left-[37%] top-[10px] h-[44px] w-[132px] rounded-full bg-[#0b8d10]/55" />
                    <div className="absolute right-[70px] top-[10px] h-[76px] w-[170px] rounded-full bg-white/8" />
                    <div className="absolute bottom-[-18px] left-[39%] h-[58px] w-[120px] rounded-full bg-white/14" />
                    <div className="absolute right-[10px] top-[8px] h-[16px] w-[16px] rounded-full bg-white/12" />
                    <div className="absolute bottom-[4px] right-[5px] text-[18px] text-white/95">✦</div>
                </div>

                <div className="relative flex min-h-[78px] items-center justify-center px-4 py-5 sm:px-6 md:min-h-[79px]">
                    <p className="text-center text-[13px] font-medium leading-none text-white sm:text-[14px] md:text-[13.5px]">
                        <span className="mr-1.5 inline-block text-[16px] align-middle">🌟</span>
                        <span className="align-middle">Member get </span>
                        <span className="align-middle font-normal text-[#ffe45d]">FREE SHIPPING*</span>
                        <span className="align-middle"> with no order minimum!. *Restriction apply </span>
                        <span className="align-middle underline underline-offset-[2px]">Try free 30-days trial!</span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Free;