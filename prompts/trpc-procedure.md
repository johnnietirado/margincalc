When creating a new tRPC procedure, follow these steps:

1. **Define the Procedure**:
   - Create a new file in the `apps/web/src/server/api/routers` directory based on the procedure name you want to create. This should be tied to the data model it is interacting with. If there is a file already in the directory, add the procedure to the existing file.
   - Use the `createProcedure` function to define the procedure.
   - If the procedure needs to be protected, use the `protectedProcedure` function.
   - If you think that the procedure needs to be generic and not tied to a specific data model, create it in the `apps/web/src/server/api/routers/shared` directory.

2. **Input Validation**:
   - Use Zod for input validation.

3. **Database Operations**:
   - Use Drizzle ORM for database operations.

4. **Error Handling**:
   - Use the `TRPCError` class for error handling.

5. **Documentation**:
   - If you have created a new router file, add the router to the `root.ts` file in the same directory.
   - If you need an example of how to create a new router, look at the other routers in the same directory.
   - If you need an example of how to create a new procedure, look at the other procedures in the same directory.
   - If you need an example of how to create a new protected procedure, look at the other protected procedures in the same directory.
   - If you need an example of how to create a new generic procedure, look at the other generic procedures in the same directory.
