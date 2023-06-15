import { connect } from "react-redux";
import { useState } from "react";
import { resendVerificationMail } from "../../services/auth";
import { showAlert } from "../../utils/utils";



const VerifyEmailPrompt = ({ user }) => {
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      const res = await resendVerificationMail({ email: user?.email });

      if (res.status === true) {
        showAlert({
          msg: res?.message ?? "Verification email sent successfully",
          type: "success",
        });
      } else {
        showAlert({
          msg: res?.message ?? "An error occurred",
          type: "danger",
        });
      }
      setSending(false);
    } catch (e) {
      showAlert({
        msg: e.message ?? "An error occurred",
        type: "danger",
      });
      setSending(false);
    }
  };

  return (
    <section className={`${user?.email_verified_at ? "hidden" : ""} flex flex-row justify-between p-2 md:px-12 md:py-2 bg-orange-300`}>
      <p className="m-auto text-sm md:text-normal">
        <strong>Verify your email to continue:</strong> An email will be sent
        to your inbox
      </p>
      <button
        className="button mt-0 text-white rounded-lg"
        onClick={handleResend}
        disabled={sending}
      > Re-send email</button>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state?.user,
  };
};

export default connect(mapStateToProps)(VerifyEmailPrompt);