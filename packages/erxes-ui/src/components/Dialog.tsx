import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  DialogContent,
  DialogWrapper,
  ModalOverlay,
} from "@erxes/ui/src/styles/main";
import Icon from "@erxes/ui/src/components/Icon";

function DialogComponent({
  show,
  closeModal,
  title,
  children,
}: {
  show: boolean;
  closeModal: () => void;
  title: any;
  children: any;
}) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" onClose={closeModal} className={` relative z-10`}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ModalOverlay />
        </Transition.Child>
        <DialogWrapper>
          <DialogContent>
            <Dialog.Panel className={` dialog-size-lg`}>
              <Dialog.Title as="h3">
                {title}
                <Icon icon="times" size={24} onClick={closeModal} />
              </Dialog.Title>
              <Transition.Child>
                <div className="dialog-description">{children}</div>
              </Transition.Child>
            </Dialog.Panel>
          </DialogContent>
        </DialogWrapper>
      </Dialog>
    </Transition>
  );
}

export default DialogComponent