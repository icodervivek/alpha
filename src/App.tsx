"use client";

import type React from "react";
import { useState } from "react";

const CAR_IMAGES: string[] = [
  "/images/car_front.jpeg",
  "/images/car_side.jpeg",
  "/images/car_back.jpeg",
  "/images/car_interior.jpeg",
];

// These would be frame-by-frame images of the same car rotated.
const CAR_360_FRAMES: string[] = [
  "/images/360/frame_1.jpeg",
  "/images/360/frame_2.jpeg",
  "/images/360/frame_3.jpeg",
  "/images/360/frame_4.jpeg",
  "/images/360/frame_5.jpeg",
  "/images/360/frame_6.jpeg",
];

const basePricePerInvitePerHour = 50; // you can tweak this

type PointerEvent = React.MouseEvent<Element> | React.TouchEvent<Element>;

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [show360, setShow360] = useState<boolean>(false);
  const [frameIndex, setFrameIndex] = useState<number>(0);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartFrame, setDragStartFrame] = useState<number>(0);

  const [invites, setInvites] = useState<string>("50");
  const [duration, setDuration] = useState<string>("3");

  const invitesNum = Number(invites) || 0;
  const durationNum = Number(duration) || 0;

  const totalPrice = invitesNum * durationNum * basePricePerInvitePerHour;

  const car = {
    model: "Alpha Motors ZX Turbo",
    year: 2022,
    mileage: "18,500 km",
    price: "₹9,80,000",
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Bengaluru",
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? CAR_IMAGES.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === CAR_IMAGES.length - 1 ? 0 : prev + 1
    );
  };

  const handleToggle360 = () => {
    if (!show360) setFrameIndex(0);
    setShow360((prev) => !prev);
  };

  const handleFrameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrameIndex(Number(e.target.value));
  };

  const getClientX = (e: PointerEvent): number => {
    if ("touches" in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    return (e as React.MouseEvent<Element>).clientX;
  };

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(getClientX(e));
    setDragStartFrame(frameIndex);
  };

  const handleDragMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    const currentX = getClientX(e);
    const deltaX = currentX - dragStartX;

    const sensitivity = 15; // px per frame
    const framesMoved = Math.floor(deltaX / sensitivity);

    let nextFrame = (dragStartFrame + framesMoved) % CAR_360_FRAMES.length;
    if (nextFrame < 0) nextFrame += CAR_360_FRAMES.length;

    setFrameIndex(nextFrame);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffe9f0_0,#f5f5f7_40%)] font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 px-8 py-4 shadow-sm backdrop-blur">
        <div className="text-xl font-extrabold tracking-wide">Alpha</div>
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          <span className="cursor-pointer hover:text-slate-900">Buy Car</span>
          <span className="cursor-pointer hover:text-slate-900">Sell Car</span>
          <span className="cursor-pointer hover:text-slate-900">Support</span>
        </nav>
      </header>

      {/* Shell */}
      <section className="flex justify-center px-4 py-6">
        <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* LEFT: Carousel + 360 */}
          <div className="flex flex-col gap-6">
            {/* Carousel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 pb-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                  Featured
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {car.year} · {car.fuelType} · {car.transmission}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg"
                  onClick={handlePrevImage}
                  type="button"
                >
                  &lt;
                </button>
                <div className="flex-1 overflow-hidden rounded-xl">
                  <img
                    src={CAR_IMAGES[currentImageIndex]}
                    alt="Car"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    width={900}
                    height={600}
                    priority
                  />
                </div>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg"
                  onClick={handleNextImage}
                  type="button"
                >
                  &gt;
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {CAR_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-4 bg-rose-400"
                          : "w-2 bg-slate-300"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  {currentImageIndex + 1}/{CAR_IMAGES.length} photos
                </span>
              </div>
            </div>

            {/* 360° View */}
            <div className="rounded-2xl border border-slate-200 border-l-4 border-l-rose-400 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    360° View
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Click the button to enable an interactive 360° view and drag
                    to rotate the car.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggle360}
                  className="whitespace-nowrap rounded-full bg-gradient-to-r from-rose-400 to-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
                >
                  {show360 ? "Disable 360° View" : "Enable 360° View"}
                </button>
              </div>

              {!show360 && (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3.5 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700">
                    360°
                  </div>
                  <p className="text-xs text-slate-600">
                    360° mode is currently off. Click{" "}
                    <strong>Enable 360° View</strong> to interact with the car.
                  </p>
                </div>
              )}

              {show360 && (
                <div
                  className="mt-2"
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  <div className="relative cursor-grab overflow-hidden rounded-xl border border-slate-200 active:cursor-grabbing">
                    <img
                      src={CAR_360_FRAMES[frameIndex]}
                      alt="Car 360 frame"
                      className="w-full"
                      width={900}
                      height={600}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-slate-900/70 to-transparent px-3 py-1.5 text-[11px] text-slate-50">
                      <span className="text-xs">↔</span>
                      <span>Drag to rotate</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={CAR_360_FRAMES.length - 1}
                    value={frameIndex}
                    onChange={handleFrameChange}
                    className="mt-3 w-full accent-rose-500"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Drag on the image (or adjust the slider) to see the car from
                    every angle.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Car overview + calculator */}
          <div className="flex flex-col gap-6">
            {/* Car Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Car Overview
                </h2>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  Inspected
                </span>
              </div>

              <h1 className="mb-2 text-xl font-semibold text-slate-900">
                {car.model}
              </h1>

              <div className="mb-3 flex items-baseline gap-2">
                <p className="text-lg font-bold text-emerald-700">
                  {car.price}
                </p>
                <span className="text-[11px] text-slate-500">
                  On-road estimate
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700">
                  {car.year} Model
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700">
                  {car.mileage}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700">
                  {car.location}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Fuel Type</span>
                  <span className="font-medium text-slate-800">
                    {car.fuelType}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">
                    Transmission
                  </span>
                  <span className="font-medium text-slate-800">
                    {car.transmission}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Ownership</span>
                  <span className="font-medium text-slate-800">1st Owner</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">
                    Registration
                  </span>
                  <span className="font-medium text-slate-800">
                    KA-01 • Private
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="flex-1 min-w-[140px] rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2 text-center text-xs font-medium text-white shadow-sm"
                >
                  Book Test Drive
                </button>
                <button
                  type="button"
                  className="flex-1 min-w-[140px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-medium text-slate-900"
                >
                  Get Call Back
                </button>
              </div>
            </div>

            {/* Price Calculator */}
            <div className="mt-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <h2 className="text-sm font-semibold text-slate-900">
                Event Price Calculator
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Estimate event cost based on number of invites and event
                duration.
              </p>

              <form
                className="mt-3 flex flex-col gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-wrap gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <label
                      htmlFor="invites"
                      className="text-xs font-medium text-slate-700"
                    >
                      Number of Invites
                    </label>
                    <input
                      id="invites"
                      type="number"
                      value={invites}
                      onChange={(e) => setInvites(e.target.value)}
                      placeholder="e.g. 100"
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <label
                      htmlFor="duration"
                      className="text-xs font-medium text-slate-700"
                    >
                      Duration (hours)
                    </label>
                    <input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 4"
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                    />
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3 text-xs">
                  <p className="text-slate-600">
                    <strong>Formula:</strong> invites × duration ×{" "}
                    {basePricePerInvitePerHour}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-slate-500">
                        Estimated Event Cost
                      </p>
                      <p className="text-xl font-semibold">
                        ₹
                        {totalPrice.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">
                      ₹{basePricePerInvitePerHour} / invite / hour
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
