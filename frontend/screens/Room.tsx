import { Suspense } from 'react';
import Dashboard from '../components/room/Dashboard';

export default function Room() {
    return (
        <Suspense fallback={null}>
            <Dashboard />
        </Suspense>
    );
}
