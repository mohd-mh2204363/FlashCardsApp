'use client'
import React, { useState } from 'react'
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from 'next/navigation'
export default function page() {
    const data = [
        { id: 1, name: 'Instance #1', description: 'This is a description for Instance #1' },
        { id: 2, name: 'Instance #2', description: 'This is a description for Instance #2' },
        { id: 3, name: 'Instance #3', description: 'This is a description for Instance #3' },
    ]
    const [activeTab, setActiveTab] = useState('tiles');
    const router = useRouter();

    return (
        <>
            <div className='flex flex-col items-center w-full min-h-screen'>
                <div className='flex w-4/5 justify-start mt-2.5'>
                    <h1 className='text-4xl font-bold text-gray-200 my-8.5'>Your History</h1>
                </div>
                <div className="gap-4 w-4/5 mt-2.5">
                    <div className=" rounded shadow" />
                    <div className="rounded flex justify-between px-5.5 ">
                        <Button
                            className="bg-gray-950 text-gray-200 border-1 border-gray-700 hover:bg-gray-700"
                            onClick={() => router.push('/')}
                        >
                            Create New +
                        </Button>
                        <div className="flex gap-6">
                            <Tabs defaultValue="tiles">
                                <TabsList className="">
                                    <TabsTrigger value="tiles" onClick={() => setActiveTab('tiles')} className="text-gray-500 border-1 border-gray-300 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-800 ">Tiles</TabsTrigger>
                                    <TabsTrigger value="cards" onClick={() => setActiveTab('cards')} className="text-gray-500 border-1 ml-1.5 border-gray-300 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-800 ">Cards</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {activeTab === 'cards' && (
                        <div className="rounded grid grid-cols-3 gap-5 mt-4">
                            {data.map((item) => (
                                <Card className="bg-gray-950 border-2 border-gray-800 shadow hover:scale-102 transition-transform duration-100" key={item.id}>
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-gray-200 font-bold">{item.name}</CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <p className="text-gray-400">{item.description}</p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                    {activeTab === 'tiles' && (
                        <div className="rounded grid grid-cols-1 gap-5 mt-4">
                            {data.map((item) => (
                                <Card className="bg-gray-950 border-2 border-gray-800 shadow hover:scale-102 transition-transform duration-100" key={item.id}>
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-gray-200 font-bold">{item.name}</CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <p className="text-gray-400">{item.description}</p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}
