"use client"

import { useEffect, RefObject } from "react"

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  callback: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) callback()
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, callback, enabled])
}
