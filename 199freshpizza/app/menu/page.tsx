"use client"

import { useRouter } from "next/navigation"
import MenuModal from "../components/menu-modal"

export default function MenuPage() {
  const router = useRouter()

  return (
    <MenuModal
      isOpen={true}
      onClose={() => router.push("/")}
    />
  )
}
