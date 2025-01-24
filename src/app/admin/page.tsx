import LoginForm from "@/components/admin-panel/LoginForm"
import { Loader } from "@/components/common/Loader"

export default function AdminLoginPage() {
  return (

    <FE_Layout>
      <div className={`flex justify-center items-center min-h-screen`}>
        <Card className=" lg:w-[470px] lg:h-[450px] tab:mx-30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-color-text  ml-8">
              Admin Login
            </h2>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="username"
              label="Username"
              type="text"
              placeholder="Enter Rank"
              value={formData?.username}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
              }}
              errors={errors}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter Rank"
              value={formData?.password}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
              }}
              errors={errors}
            />

            <Button className="mt-6 mt-3" type="submit">
              Login
            </Button>
          </form>
        </Card>
      </div>
    </FE_Layout>

    <>
      <LoginForm />
      <Loader />
    </>
  )
}
