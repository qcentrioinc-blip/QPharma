export default function Production() {
    return (
        <section
            style={{
                position: "relative",
                overflow: "hidden",
                background: "#ffffff",
                padding: "28px 0 36px",
            }}
        >
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "min(1080px, calc(100% - 36px))",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "42px",
                }}
            >
                {/* CARD 1 WRAPPER */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "990px",
                        alignSelf: "flex-start",
                    }}
                >
                    {/* RIGHT STEPPED LINES */}
                    <svg
                        aria-hidden="true"
                        width="230"
                        height="245"
                        viewBox="0 0 230 245"
                        fill="none"
                        style={{
                            position: "absolute",
                            top: "-58px",
                            right: "-178px",
                            pointerEvents: "none",
                            zIndex: 0,
                            overflow: "visible",
                        }}
                    >
                        <path d="M214 0V220H0" stroke="#1a472a" strokeWidth="2" />
                        <path d="M158 0V146H0" stroke="#1a472a" strokeWidth="2" />
                        <path d="M102 0V72H0" stroke="#1a472a" strokeWidth="2" />
                    </svg>

                    {/* CARD 1 */}
                    <article
                        style={{
                            position: "relative",
                            isolation: "isolate",
                            overflow: "hidden",
                            width: "100%",
                            minHeight: "186px",
                            borderRadius: "22px 22px 78px 22px",
                            boxShadow: "0 5px 24px rgba(50, 80, 30, 0.07)",
                            zIndex: 2,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: "url(/Production.png)",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "65% center",
                                transform: "scale(1.02)",
                            }}
                            aria-hidden="true"
                        />

                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 1,
                                background:
                                    "linear-gradient(90deg, rgba(236,244,226,0.985) 0%, rgba(236,244,226,0.96) 14%, rgba(236,244,226,0.88) 28%, rgba(236,244,226,0.50) 50%, rgba(236,244,226,0.08) 72%, transparent 100%)",
                            }}
                            aria-hidden="true"
                        />

                        <div
                            style={{
                                position: "absolute",
                                zIndex: 2,
                                pointerEvents: "none",
                                inset: "-12% -4% -4% -18%",
                                background:
                                    "repeating-radial-gradient(130% 108% at 16% -8%, rgba(255,255,255,0.50) 0 2px, transparent 2px 24px)",
                                transform: "rotate(-3deg) scale(1.15)",
                                opacity: 0.55,
                            }}
                            aria-hidden="true"
                        />

                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                zIndex: 2,
                                width: "160px",
                                height: "110px",
                                background:
                                    "linear-gradient(180deg, rgba(170,205,85,0.68) 0%, rgba(88,140,36,0.16) 100%)",
                                clipPath:
                                    "polygon(0% 100%,0% 44%,5% 26%,11% 48%,17% 18%,25% 52%,33% 20%,43% 58%,51% 24%,61% 66%,69% 30%,81% 70%,100% 100%)",
                                opacity: 0.72,
                            }}
                            aria-hidden="true"
                        />

                        <div
                            style={{
                                position: "relative",
                                zIndex: 3,
                                maxWidth: "46%",
                                padding: "34px 32px 28px 40px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#4a7c3a",
                                    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                                    lineHeight: 1,
                                    fontWeight: 400,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                <span style={{ display: "block" }}>Production</span>
                                <span style={{ display: "block" }}>&amp; Facilities</span>
                            </h2>

                            <a
                                href="#"
                                style={{
                                    marginTop: "18px",
                                    width: "fit-content",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "9px 17px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.97)",
                                    color: "#5c8644",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    boxShadow: "0 3px 14px rgba(60,90,40,0.10)",
                                }}
                            >
                                <span>Watch now</span>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <path
                                        d="M3.5 1.5L7.5 5.5L3.5 9.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                    </article>
                </div>

                {/* CARD 2 WRAPPER */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "980px",
                        alignSelf: "flex-end",
                        marginTop: "8px",
                    }}
                >
                    {/* LEFT CIRCLES */}
                    <svg
                        aria-hidden="true"
                        width="280"
                        height="280"
                        viewBox="0 0 280 280"
                        fill="none"
                        style={{
                            position: "absolute",
                            left: "-420px",
                            top: "45%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            zIndex: 0,
                            overflow: "visible",
                        }}
                    >
                        {[150, 120, 90, 60, 30].map((r, i) => (
                            <circle
                                key={i}
                                cx="160"
                                cy="160"
                                r={r}
                                stroke="#163f2a"
                                strokeWidth="2"
                                fill="none"
                            />
                        ))}
                    </svg>

                    {/* CARD 2 */}
                    <article
                        style={{
                            position: "relative",
                            isolation: "isolate",
                            overflow: "hidden",
                            width: "100%",
                            minHeight: "248px",
                            borderRadius: "78px 22px 22px 22px",
                            boxShadow: "0 5px 24px rgba(140, 110, 50, 0.07)",
                            alignSelf: "flex-end",
                            zIndex: 2,
                            background: "#fffaf2",
                        }}
                    >
                        {/* Background photo */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: "url(/Research.png)",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "62% center",
                                transform: "scale(1.02)",
                            }}
                            aria-hidden="true"
                        />

                        {/* Cream-white fade overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 1,
                                background:
                                    "linear-gradient(90deg, rgba(250,242,228,0.985) 0%, rgba(250,242,228,0.96) 14%, rgba(250,242,228,0.88) 28%, rgba(250,242,228,0.50) 52%, rgba(250,242,228,0.08) 74%, transparent 100%)",
                            }}
                            aria-hidden="true"
                        />

                        {/* Diagonal wave lines */}
                        <div
                            style={{
                                position: "absolute",
                                zIndex: 2,
                                pointerEvents: "none",
                                inset: "-14% -3% -6% -16%",
                                background:
                                    "repeating-radial-gradient(130% 110% at 10% -12%, rgba(255,255,255,0.48) 0 2px, transparent 2px 24px)",
                                transform: "rotate(-3deg) scale(1.15)",
                                opacity: 0.5,
                            }}
                            aria-hidden="true"
                        />

                        {/* Sand wave accent bottom */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                zIndex: 2,
                                width: "55%",
                                height: "70px",
                                background:
                                    "repeating-radial-gradient(120% 140% at 4% 120%, rgba(205,160,75,0.32) 0 1px, transparent 1px 9px)",
                                clipPath:
                                    "polygon(0 78%,7% 62%,16% 70%,26% 56%,36% 64%,48% 50%,62% 64%,74% 54%,100% 64%,100% 100%,0 100%)",
                                opacity: 0.72,
                            }}
                            aria-hidden="true"
                        />

                        {/* Content block */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 3,
                                maxWidth: "50%",
                                padding: "44px 32px 36px 64px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#b87a15",
                                    fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
                                    lineHeight: 1.05,
                                    fontWeight: 400,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                <span style={{ display: "block" }}>Research &amp;</span>
                                <span style={{ display: "block" }}>Development</span>
                            </h2>

                            <a
                                href="#"
                                style={{
                                    marginTop: "20px",
                                    width: "fit-content",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "9px 17px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.97)",
                                    color: "#b87a15",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    boxShadow: "0 3px 14px rgba(140,110,50,0.10)",
                                }}
                            >
                                <span>Watch now</span>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                    <path
                                        d="M3.5 1.5L7.5 5.5L3.5 9.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}