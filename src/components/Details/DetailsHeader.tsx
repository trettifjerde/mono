import { ReactNode } from "react"

export function DetailsHeader({heading, skeleton, children}: {
    skeleton: boolean,
    heading?: string, 
    children?: ReactNode
}) {
    return <header>
        <hgroup>
            <h1>{heading || (!skeleton && 'Oops!')}</h1>
            {children}
        </hgroup>        
    </header>
}