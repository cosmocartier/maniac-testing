"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PrecisionPost5() {
  return (
    <Card className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group cursor-pointer">
      <div className="aspect-video relative overflow-hidden">
        <img src="/images/precision-lock.png" alt="Security Lock" className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            Security
          </Badge>
          <span className="text-xs text-gray-400">PAID USERS ONLY</span>
        </div>
        <CardTitle className="text-white group-hover:text-gray-200 transition-colors">
          Advanced Strategy Protocols
        </CardTitle>
        <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors">
          Implementing next-generation strategy measures for enterprise applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">32.121 Active Users</span>
          <span className="text-xs text-gray-500">Strategy</span>
        </div>
      </CardContent>
    </Card>
  )
}
