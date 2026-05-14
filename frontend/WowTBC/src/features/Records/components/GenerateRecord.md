## Generate Record with button

**Target Component:** `\wsl.localhost\Ubuntu\home\davidprz\projects\WowTBC_ERP\frontend\WowTBC\src\features\Records\components\SystemRecordsHeader.tsx`

### Frontend Implementation
1. **API Function**: Create a new function (e.g., `generateRecord()`) in an API file that sends a POST request to the new backend endpoint.
2. **React Query Mutation**: Implement a `useMutation` hook (e.g., `useGenerateRecord`) to handle the API call.
3. **Invalidation**: On successful mutation (`onSuccess`), call `queryClient.invalidateQueries({ queryKey: ['records'] })` to refresh the records table.
4. **Button State**: Update the "Generate Record" button in `SystemRecordsHeader.tsx` to use the mutation. Disable the button while `mutation.isPending` is true.
5. **Toast Notifications**: 
   - Show a loading toast or spinner when the generation starts.
   - Show a success toast (`toast.success`) when the mutation completes successfully.
   - Show an error toast (`toast.error`) if the generation fails.

### Backend Implementation
1. **Endpoint Creation**: Create a new POST endpoint in `views.py` (e.g., `GenerateRecordView(APIView)`).
2. **Execute Django Command**: Inside the view, use Django's `call_command` utility from `django.core.management` to programmatically execute the `get_pricing_data` command.
   - Example: `call_command('get_pricing_data')`
3. **Error Handling**: Wrap the command execution in a `try-except` block to catch any errors and return an appropriate HTTP response (e.g., 500 Internal Server Error with details).
4. **URL Registration**: Register the new endpoint in the app's `urls.py` (e.g., `path('records/generate/', GenerateRecordView.as_view(), name='generate-record')`).
5. **Response**: Return a success response (e.g., HTTP 200 OK) with a message indicating the snapshot was successfully generated.