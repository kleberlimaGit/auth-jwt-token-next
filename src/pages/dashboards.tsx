import { useContextSelector } from 'use-context-selector'
import { AuthContext } from "@/contexts/AuthContext";
import { useEffect } from 'react';
import { api } from '@/libs/api';

export default function Dashboards() {
    const {isAuthenticated, user} = useContextSelector(AuthContext, (context) => {
        return {
          isAuthenticated:context.isAuthenticated,
          user:context.user
        }
      })

    useEffect(() => {
        api.get('/me').then(res => {
            console.log(res)
        }).catch(err => {
          console.log(err)
        })
    }, [])

    return <h1>Hello World {user?.email}</h1>
}