import {z}from 'zod';

const userSchema=z.object({
  userName:z.string(),
});
const user={
  userName:'Nqobile',
};
console.log(userSchema.safeParse(user));

const App = () => {
  return (
    <div>
      <h1 className='bg-red-200 font-bold text-4xl '>SKINTELLECT</h1>
    </div>
  );
}

export default App;
