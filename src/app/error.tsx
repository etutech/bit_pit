"use client"

export default function ({ error }: { error: Error }) {
  return (
    <div className=" p-8">
      <h1 className="text-2xl text-error font-poppins font-bold">ERROR: {error.message}</h1>
    </div>
  )
}