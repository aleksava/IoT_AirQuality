import { RecoilValueReadOnly, useRecoilValueLoadable } from 'recoil';

export default function useLoadable<Type>(state: RecoilValueReadOnly<Type>) {
    const loadable = useRecoilValueLoadable<Type>(state);

    return {
        loading: loadable.state === 'loading',
        error: loadable.state === 'hasError' ? loadable.contents : undefined,
        data: loadable.state === 'hasValue' ? loadable.contents : undefined
    };
}
