import React from 'react';
import { Input } from "@/components/ui/input";

const ArticleSection = () => {
  return (
    <div>
    <h3 className='font-Poppins font-semibold text-2xl leading-8'>Latest articles</h3>
    
        <div className="grid w-full max-w-sm items-center gap-3">
            <Input type="Search" id="Search" placeholder="Search" />
        </div>
    
    </div>
  )
}

export default ArticleSection
