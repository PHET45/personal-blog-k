import React from 'react'
import { Input } from "@/components/ui/input"

const ArticleSection = () => {
  return (
    <div>
        <div className="grid w-full max-w-sm items-center gap-3">
            <Input type="email" id="email" placeholder="Email" />
        </div>
    </div>
  )
}

export default ArticleSection
