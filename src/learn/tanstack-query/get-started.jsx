import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { useState } from 'react';
import { apis } from './apis';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function TanStackQueryGetStarted() {
  return (
    <QueryClientProvider client={client}>
      <>
        <Kid />
        <Kid />
      </>
    </QueryClientProvider>
  );
}

function Kid() {
  const [it, setIt] = useState(0);

  const query = useQuery({
    queryKey: ['books'],
    queryFn: apis.getBooks,
  });
  const theClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apis.addBook,
    onSuccess() {
      theClient.invalidateQueries({
        queryKey: ['books'],
      });
    },
  });

  console.log({ query });

  return (
    <>
      <div>
        {query.isLoading || query.isFetching
          ? 'loading...'
          : 'done loading: ' + query.data.join(', ')}
      </div>
      <button
        onClick={() => {
          setIt((old) => old + 1);
          mutation.mutate(Date.now());
        }}
      >
        test {it}
      </button>
    </>
  );
}
