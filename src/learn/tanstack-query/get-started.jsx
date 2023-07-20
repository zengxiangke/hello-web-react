import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { useState } from "react";
import { apis } from "./apis";

// 1: build client
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function TanStackQueryGetStarted() {
  return (
    // 2: provide the client
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

  // 3: use querys
  const query = useQuery({
    queryKey: ["books"],
    queryFn: apis.getBooks,
  });
  // 4: use client
  const theClient = useQueryClient();

  // 5: use mutation
  const mutation = useMutation({
    mutationFn: apis.addBook,
    onSuccess() {
      theClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });

  console.log({ query });

  return (
    <>
      <div>
        {query.isLoading || query.isFetching
          ? "loading..."
          : "done loading: " + query.data.join(", ")}
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
