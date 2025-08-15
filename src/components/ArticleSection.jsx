import React from 'react'
import { Input } from "@/components/ui/input"

const ArticleSection = () => {
  return (
    <div>
        <div className="grid w-full max-w-sm items-center gap-3">
            <Input type="search" id="search" placeholder="search" />
        </div>
    </div>
  )
}

export default ArticleSection
